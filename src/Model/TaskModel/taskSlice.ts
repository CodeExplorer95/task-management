import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastMessage } from '../../Adapter/Alert/ToastMessage';
import {
  cancelTaskReminder,
  initNotifications,
  scheduleTaskReminder,
} from '../../Adapter/Notifications/notificationService';
import {
  deleteTaskFromFirestore,
  upsertTaskToFirestore,
} from './firestoreService';
import {
  deleteTaskDB,
  getAllTasks,
  getPendingTasks,
  getTaskById,
  insertTask,
  markSynced,
  updateTaskDB,
} from './sqliteService';

export interface Task {
  id: string;
  title: string;
  notes?: string | null;
  completed: boolean;
  reminderAt?: number | null;
  createdAt: number;
  updatedAt?: number;
  syncStatus?: 'pending' | 'updated' | 'deleted' | 'synced';
}

export const loadTasks = createAsyncThunk('tasks/load', async () => {
  const rows = await getAllTasks();
  return rows as Task[];
});

const FALLBACK_KEY = 'tasks_fallback_v1';

async function pushFallbackTask(task: Task) {
  try {
    const raw = await AsyncStorage.getItem(FALLBACK_KEY);
    const arr = raw ? (JSON.parse(raw) as Task[]) : [];
    arr.push(task);
    await AsyncStorage.setItem(FALLBACK_KEY, JSON.stringify(arr));
    console.log('[fallback] queued task', task.id);
  } catch (e) {
    console.warn('[fallback] push failed', e);
  }
}

async function drainFallbackQueueIfOnline() {
  try {
    const net = await NetInfo.fetch();
    if (!net.isConnected) return;
    const raw = await AsyncStorage.getItem(FALLBACK_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw) as Task[];
    if (!arr || !arr.length) return;
    console.log('[fallback] processing queue length=', arr.length);
    const results: any[] = [];
    for (const t of arr) {
      try {
        await upsertTaskToFirestore(t);
        // attempt to persist to sqlite now that network/remote is available
        try {
          await insertTask(t);
          await markSynced(t.id);
        } catch (e) {
          console.warn('[fallback] insert after remote upsert failed', e);
        }
        results.push({ id: t.id, ok: true });
      } catch (e) {
        console.warn('[fallback] upsert failed for', t.id, e);
        results.push({ id: t.id, ok: false, error: String(e) });
      }
    }
    // clear queue on success for all items
    await AsyncStorage.removeItem(FALLBACK_KEY);
    console.log('[fallback] queue processed', results);
  } catch (e) {
    console.warn('[fallback] drain failed', e);
  }
}

export const addTask = createAsyncThunk(
  'tasks/add',
  async (payload: {
    id?: string;
    title: string;
    notes?: string;
    reminderAt?: number | null;
  }) => {
    const id = payload.id ?? `${Date.now()}`;
    const now = Date.now();
    const task: Task = {
      id,
      title: payload.title,
      notes: payload.notes ?? null,
      completed: false,
      reminderAt: payload.reminderAt ?? null,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
    };
    try {
      await insertTask(task);
    } catch (e) {
      console.warn('insertTask failed, continuing with in-memory state', e);
      try {
        ToastMessage.TOAST_SHORT_BOTTOM(
          'Local DB insert failed (queued for sync when online)',
        );
      } catch (t) {
        /* ignore */
      }
      // queue fallback save so offline data is not lost
      try {
        await pushFallbackTask(task);
      } catch (err) {
        console.warn('pushFallbackTask failed', err);
      }
    }

    try {
      await initNotifications();
      if ((task as any).reminderAt) {
        await scheduleTaskReminder(task as any);
      }
    } catch (e) {
      console.warn('scheduling reminder failed', e);
    }
    try {
      const net = await NetInfo.fetch();
      if (net.isConnected) {
        // drain any queued fallback first
        await drainFallbackQueueIfOnline();
        await upsertTaskToFirestore(task);
        try {
          await markSynced(task.id);
          task.syncStatus = 'synced';
        } catch (e) {
          console.warn('markSynced failed', e);
        }
      }
    } catch (e) {
      console.warn('network check failed', e);
    }
    // return fresh rows from local DB so UI reflects the local DB state even when offline
    let rows = await getAllTasks();
    // if DB insert failed or didn't persist, ensure UI still shows the new task optimistically
    if (!rows.find(r => r.id === task.id)) {
      rows = [task as any, ...(rows ?? [])];
    }
    return rows as Task[];
  },
);

export const editTask = createAsyncThunk(
  'tasks/edit',
  async ({ id, patch }: { id: string; patch: Partial<Task> }) => {
    const updatedAt = Date.now();
    try {
      await updateTaskDB(id, { ...patch, updatedAt, syncStatus: 'updated' });
    } catch (e) {
      console.warn('updateTaskDB failed, optimistic update only', e);
    }
    // if reminder changed, reschedule or cancel
    try {
      await initNotifications();
      const p: any = patch;
      if (p.reminderAt !== undefined) {
        if (p.reminderAt === null) {
          await cancelTaskReminder(id);
        } else {
          const row = await getTaskById(id);
          const task = { ...(row ?? {}), ...patch } as Task & {
            reminderAt?: number;
          };
          await scheduleTaskReminder(task as any);
        }
      }
    } catch (e) {
      console.warn('reschedule reminder failed', e);
    }
    // attempt immediate remote sync when online
    try {
      const net = await NetInfo.fetch();
      if (net.isConnected) {
        const fresh = await getTaskById(id);
        if (fresh) {
          try {
            await upsertTaskToFirestore(fresh as Task);
            await markSynced(id);
            // reflect synced state
            // no need to mutate here; subsequent getAllTasks will show synced row
          } catch (e) {
            console.warn('immediate edit upsert failed, will sync later', e);
          }
        }
      }
    } catch (e) {
      console.warn('edit immediate sync check failed', e);
    }
    // fetch fresh rows and apply optimistic patch in case DB update didn't persist yet
    let rows = await getAllTasks();
    rows = (rows || []).map(r => {
      if (r.id === id) {
        return { ...r, ...patch, updatedAt } as Task;
      }
      return r;
    });
    return rows as Task[];
  },
);

export const removeTask = createAsyncThunk(
  'tasks/remove',
  async (id: string) => {
    const now = Date.now();
    try {
      // try remote delete first
      await deleteTaskFromFirestore(id);
      // remove locally
      await deleteTaskDB(id);
      // cancel any scheduled reminder
      try {
        await initNotifications();
        await cancelTaskReminder(id);
      } catch (e) {
        console.warn('cancel reminder on delete failed', e);
      }
    } catch (e) {
      console.warn('remote delete failed, marking locally as deleted', e);
      ToastMessage.TOAST_SHORT_BOTTOM(
        'Delete failed — task will be removed when online',
      );
      try {
        await updateTaskDB(id, { syncStatus: 'deleted', updatedAt: now });
      } catch (err) {
        console.warn('updateTaskDB failed while marking deleted', err);
      }
    }
    // return optimistic rows: try DB read, but if empty, return empty array so reducer keeps items if needed
    try {
      const rows = await getAllTasks();
      return rows as Task[];
    } catch (e) {
      console.warn('getAllTasks failed after delete', e);
      return [] as Task[];
    }
  },
);

export const toggleComplete = createAsyncThunk(
  'tasks/toggle',
  async ({ id, completed }: { id: string; completed: boolean }) => {
    try {
      await updateTaskDB(id, {
        completed,
        syncStatus: 'updated',
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('toggle update failed, optimistic only', e);
    }
    // try immediate sync when online
    try {
      const row = await getTaskById(id);
      const net = await NetInfo.fetch();
      if (row && net.isConnected) {
        try {
          await upsertTaskToFirestore({ ...row, completed });
          await markSynced(id);
        } catch (e) {
          console.warn('immediate toggle upsert failed, will sync later', e);
        }
      }
    } catch (e) {
      console.warn('toggle immediate sync check failed', e);
    }

    // if task completed and had reminder, cancel local reminder
    try {
      const row = await getTaskById(id);
      if (row && row.reminderAt && completed) {
        await initNotifications();
        await cancelTaskReminder(id);
      }
    } catch (e) {
      console.warn('cancel reminder on complete failed', e);
    }

    const rows = await getAllTasks();
    return rows as Task[];
  },
);

export const syncPendingTasks = createAsyncThunk('tasks/sync', async () => {
  // process any fallback queue stored in AsyncStorage first
  try {
    await drainFallbackQueueIfOnline();
  } catch (e) {
    console.warn('[syncPendingTasks] drainFallbackQueueIfOnline failed', e);
  }
  const pending = await getPendingTasks();
  console.log('[syncPendingTasks] start, pendingCount=', pending.length);
  const results: any[] = [];
  for (const t of pending) {
    console.log(
      '[syncPendingTasks] processing id=',
      t.id,
      'syncStatus=',
      t.syncStatus,
    );
    try {
      // re-read the latest row from local DB to ensure we have the freshest fields
      const fresh = await getTaskById(t.id);
      console.log('[syncPendingTasks] fresh local row=', fresh);
      if (!fresh) {
        console.log(
          '[syncPendingTasks] local row disappeared, skipping id=',
          t.id,
        );
        results.push({ id: t.id, ok: false, error: 'missing_local_row' });
        continue;
      }

      if (fresh.syncStatus === 'deleted') {
        console.log('[syncPendingTasks] deleting remote id=', fresh.id);
        await deleteTaskFromFirestore(fresh.id);
        await deleteTaskDB(fresh.id);
      } else {
        console.log('[syncPendingTasks] upserting remote id=', fresh.id);
        await upsertTaskToFirestore(fresh);
        await markSynced(fresh.id);
      }
      console.log('[syncPendingTasks] ok id=', fresh.id);
      results.push({ id: fresh.id, ok: true });
    } catch (e) {
      console.error('[syncPendingTasks] error id=', t.id, e);
      // ensure error is serializable for redux actions
      const errStr = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
      results.push({ id: t.id, ok: false, error: errStr });
    }
  }
  console.log('[syncPendingTasks] finished');
  // return fresh rows so caller can update UI immediately
  const freshRows = await getAllTasks();
  return { results, rows: freshRows };
});

export const syncTask = createAsyncThunk(
  'tasks/syncOne',
  async (id: string, thunkAPI) => {
    // mark syncing in store
    thunkAPI.dispatch(tasksSlice.actions.startSync(id));
    try {
      // fetch current local row
      const t = await getTaskById(id);
      if (t) {
        if (t.syncStatus === 'deleted') {
          await deleteTaskFromFirestore(t.id);
          await deleteTaskDB(t.id);
        } else {
          await upsertTaskToFirestore(t);
          await markSynced(t.id);
        }
      } else {
        console.warn('[syncTask] local row not found for id=', id);
      }
    } catch (e) {
      console.error('[syncTask] error id=', id, e);
    } finally {
      thunkAPI.dispatch(tasksSlice.actions.stopSync(id));
      // return fresh rows so UI refreshes after a single-task sync
      const rows = await getAllTasks();
      return rows as Task[];
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [] as Task[],
    loading: false,
    syncing: {} as Record<string, boolean>,
  },
  reducers: {
    // optimistic local-only updates used to make UI responsive offline
    optimisticAdd(state, action: PayloadAction<Task>) {
      state.items = [action.payload, ...(state.items || [])];
    },
    optimisticEdit(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Task> }>,
    ) {
      const { id, patch } = action.payload;
      state.items = (state.items || []).map(item =>
        item.id === id ? { ...item, ...patch } : item,
      );
    },
    optimisticRemove(state, action: PayloadAction<string>) {
      state.items = (state.items || []).filter(i => i.id !== action.payload);
    },
    startSync(state, action: PayloadAction<string>) {
      state.syncing[action.payload] = true;
    },
    stopSync(state, action: PayloadAction<string>) {
      delete state.syncing[action.payload];
    },
  },
  extraReducers: builder => {
    builder.addCase(loadTasks.pending, s => {
      s.loading = true;
    });
    builder.addCase(loadTasks.fulfilled, (s, a: PayloadAction<Task[]>) => {
      s.loading = false;
      s.items = a.payload;
    });
    builder.addCase(loadTasks.rejected, s => {
      s.loading = false;
    });

    builder.addCase(addTask.fulfilled, (s, a: PayloadAction<Task[]>) => {
      // addTask now returns fresh rows from the local DB so update items
      try {
        const rows = a.payload as Task[] | undefined;
        if (rows && rows.length > 0) {
          s.items = rows;
        } else {
          console.log(
            '[tasks] addTask returned empty rows; keeping existing items (optimistic)',
          );
        }
      } catch (e) {
        console.error('[tasks] error handling addTask.fulfilled', e);
      }
    });

    builder.addCase(syncPendingTasks.fulfilled, (s, a: PayloadAction<any>) => {
      // a.payload: { results, rows }
      try {
        const rows =
          a.payload && a.payload.rows ? (a.payload.rows as Task[]) : [];
        if (rows && rows.length > 0) {
          s.items = rows;
        } else {
          console.log(
            '[tasks] syncPendingTasks returned empty rows; keeping existing items',
          );
        }
      } catch (e) {
        console.error('[tasks] error handling syncPendingTasks.fulfilled', e);
      }
    });

    builder.addCase(syncTask.fulfilled, (s, a: PayloadAction<Task[]>) => {
      // syncTask now returns fresh local rows after completing a single-item sync
      try {
        const rows = a.payload as Task[] | undefined;
        if (rows && rows.length > 0) {
          s.items = rows;
        } else {
          console.log(
            '[tasks] syncTask returned empty rows; keeping existing items',
          );
        }
      } catch (e) {
        console.error('[tasks] error handling syncTask.fulfilled', e);
      }
    });

    builder.addCase(editTask.fulfilled, (s, a: PayloadAction<Task[]>) => {
      try {
        const rows = a.payload as Task[] | undefined;
        if (rows && rows.length > 0) {
          s.items = rows;
        } else {
          // payload empty: apply optimistic patch from meta.arg
          const metaArg: any = (a as any).meta?.arg;
          if (metaArg && metaArg.id && metaArg.patch) {
            const { id, patch } = metaArg;
            s.items = (s.items || []).map(item =>
              item.id === id ? { ...item, ...patch } : item,
            );
            console.log(
              '[tasks] editTask: applied optimistic patch for id=',
              id,
            );
          } else {
            console.log('[tasks] editTask returned empty rows and no meta arg');
          }
        }
      } catch (e) {
        console.error('[tasks] error handling editTask.fulfilled', e);
      }
    });

    builder.addCase(removeTask.fulfilled, (s, a: PayloadAction<Task[]>) => {
      try {
        const rows = a.payload as Task[] | undefined;
        if (rows && rows.length > 0) {
          s.items = rows;
        } else {
          // payload empty: remove optimistically using meta.arg (id)
          const id: string | undefined = (a as any).meta?.arg;
          if (id) {
            s.items = (s.items || []).filter(item => item.id !== id);
            console.log('[tasks] removeTask: optimistically removed id=', id);
          } else {
            console.log(
              '[tasks] removeTask returned empty rows and no meta arg',
            );
          }
        }
      } catch (e) {
        console.error('[tasks] error handling removeTask.fulfilled', e);
      }
    });

    builder.addCase(toggleComplete.fulfilled, (s, a: PayloadAction<Task[]>) => {
      try {
        const rows = a.payload as Task[] | undefined;
        if (rows && rows.length > 0) {
          s.items = rows;
        } else {
          // payload empty: apply optimistic completed flag from meta.arg
          const metaArg: any = (a as any).meta?.arg;
          if (
            metaArg &&
            metaArg.id !== undefined &&
            metaArg.completed !== undefined
          ) {
            const { id, completed } = metaArg;
            s.items = (s.items || []).map(item =>
              item.id === id ? { ...item, completed } : item,
            );
            console.log(
              '[tasks] toggleComplete: applied optimistic toggle for id=',
              id,
            );
          } else {
            console.log(
              '[tasks] toggleComplete returned empty rows and no meta arg',
            );
          }
        }
      } catch (e) {
        console.error('[tasks] error handling toggleComplete.fulfilled', e);
      }
    });
  },
});

export default tasksSlice.reducer;

export function startNetworkSync(dispatch: any) {
  NetInfo.addEventListener((state: any) => {
    if (state.isConnected) {
      // drain any fallback queued tasks first, then run pending sync
      drainFallbackQueueIfOnline()
        .catch((e: any) => console.warn('[startNetworkSync] drain failed', e))
        .finally(() => dispatch(syncPendingTasks()));
    }
  });
}
