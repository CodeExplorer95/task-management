import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ToastMessage } from '../../../Adapter/Alert/ToastMessage';
import { displayImmediateNotification } from '../../../Adapter/Notifications/notificationService';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../Adapter/Redux/useAppDispatch';
import { useColor } from '../../../Controller/Color/useColor';
import {
  addTask,
  editTask,
  loadTasks,
  removeTask,
  syncTask,
  toggleComplete,
} from '../../../Model/TaskModel/taskSlice';
import { useOrientation } from '../../../Utils/useOrientation';
import AddEditTaskModal from '../../Components/AddEditTaskModal';
import LoadingSpinner from '../../Components/LoadingSpinner';
import TaskCard, { getItemHeight } from '../../Components/TaskCard';

const TasksScreen = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(s => (s as any).tasks?.items ?? []);

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const syncing = useAppSelector(s => (s as any).tasks?.syncing ?? {});

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  // debug: log local DB rows on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { getAllTasks } =
          await require('../../../Model/TaskModel/sqliteService');
        const rows: any = await getAllTasks();
        if (!mounted) return;
        console.log('[DEBUG] initial local rows=', rows);
        ToastMessage.TOAST_SHORT_BOTTOM(
          `Local rows: ${Array.isArray(rows) ? rows.length : 0}`,
        );
      } catch (err) {
        console.warn('debug initial load failed', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async (payload: any) => {
    try {
      if (editing) {
        // optimistic UI update
        dispatch(
          (dispatch as any).optimisticEdit
            ? (dispatch as any).optimisticEdit({
                id: editing.id,
                patch: { title: payload.title, notes: payload.notes },
              })
            : {
                type: 'tasks/optimisticEdit',
                payload: {
                  id: editing.id,
                  patch: { title: payload.title, notes: payload.notes },
                },
              },
        );
        // fire and forget async edit
        dispatch(
          editTask({
            id: editing.id,
            patch: { title: payload.title, notes: payload.notes },
          }),
        );
        ToastMessage.TOAST_SHORT_BOTTOM('Saved locally');
      } else {
        const id = `${Date.now()}`;
        const now = Date.now();
        const task = {
          id,
          title: payload.title,
          notes: payload.notes ?? null,
          completed: false,
          createdAt: now,
          updatedAt: now,
          syncStatus: 'pending',
        };
        // optimistic add
        dispatch(
          (dispatch as any).optimisticAdd
            ? (dispatch as any).optimisticAdd(task)
            : { type: 'tasks/optimisticAdd', payload: task },
        );
        // fire and forget async add (pass id so redux returns consistent row)
        dispatch(addTask({ id, title: payload.title, notes: payload.notes }));
        ToastMessage.TOAST_SHORT_BOTTOM('Saved locally');
        setPage(1);
      }
    } catch (e) {
      console.warn('onSave failed', e);
      ToastMessage.TOAST_SHORT_BOTTOM('Save failed');
    } finally {
      setModalVisible(false);
      setEditing(null);
    }
  };

  const visibleData = useMemo(() => {
    return tasks.slice(0, page * PAGE_SIZE);
  }, [tasks, page]);

  const onEndReached = useCallback(() => {
    if (visibleData.length < tasks.length) setPage(p => p + 1);
  }, [visibleData.length, tasks.length]);

  const keyExtractor = useCallback(
    (t: any) => t.id ?? String(t.createdAt ?? Math.random()),
    [],
  );

  const handleToggle = useCallback(
    (id: string, completed: boolean) => {
      dispatch(toggleComplete({ id, completed }));
    },
    [dispatch],
  );

  const handleEdit = useCallback((t: any) => {
    setEditing(t);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      try {
        // optimistic remove
        dispatch(
          (dispatch as any).optimisticRemove
            ? (dispatch as any).optimisticRemove(id)
            : { type: 'tasks/optimisticRemove', payload: id },
        );
        // fire-and-forget delete
        dispatch(removeTask(id));
        ToastMessage.TOAST_SHORT_BOTTOM('Deleted locally');
      } catch (e) {
        console.warn('delete failed', e);
        ToastMessage.TOAST_SHORT_BOTTOM('Delete failed');
      }
    },
    [dispatch],
  );

  const handleRetry = useCallback(
    async (id: string) => {
      try {
        await dispatch(syncTask(id));
        // refresh list from local DB
        const rows: any = await dispatch(loadTasks());
        const count = Array.isArray(rows?.payload) ? rows.payload.length : 0;
        ToastMessage.TOAST_SHORT_BOTTOM(
          `Sync attempted. ${count} tasks locally`,
        );
      } catch (e) {
        console.warn('retry failed', e);
        ToastMessage.TOAST_SHORT_BOTTOM('Retry failed');
      }
    },
    [dispatch],
  );

  const { wp, hp, figmaH, figmaW } = useOrientation();
  const colors = useColor();
  const s = taskStyles(wp, hp, figmaW, figmaH, colors);
  const [heightMap, setHeightMap] = useState<Record<string, number>>({});

  const onMeasure = useCallback((id: string, h: number) => {
    setHeightMap(prev => {
      if (prev[id] === h) return prev;
      return { ...prev, [id]: h };
    });
  }, []);

  const handleLocalReminder = useCallback(
    (task: any) => {
      try {
        const reminderAt = Date.now() + 20 * 1000; // 20 seconds from now
        // optimistic edit
        dispatch(
          (dispatch as any).optimisticEdit
            ? (dispatch as any).optimisticEdit({
                id: task.id,
                patch: { reminderAt },
              })
            : {
                type: 'tasks/optimisticEdit',
                payload: { id: task.id, patch: { reminderAt } },
              },
        );
        // schedule background edit
        dispatch(editTask({ id: task.id, patch: { reminderAt } }));
        ToastMessage.TOAST_SHORT_BOTTOM('Local reminder set for 20 seconds');
        try {
          displayImmediateNotification(
            'Reminder set',
            `Will fire at ${new Date(reminderAt).toLocaleTimeString()}`,
          );
        } catch (e) {
          console.warn('displayImmediateNotification failed', e);
        }
      } catch (e) {
        console.warn('set local reminder failed', e);
        ToastMessage.TOAST_SHORT_BOTTOM('Failed to set local reminder');
      }
    },
    [dispatch],
  );

  const handleSendPush = useCallback(
    async (task: any) => {
      try {
        if (!task.reminderAt) {
          await dispatch(
            editTask({
              id: task.id,
              patch: { reminderAt: Date.now() + 10 * 1000 },
            }),
          );
        }
        await dispatch(syncTask(task.id));
      } catch (e) {
        console.warn('send push failed', e);
        ToastMessage.TOAST_SHORT_BOTTOM('Failed to request cloud push');
      }
    },
    [dispatch],
  );

  return (
    <View style={s.page}>
      <View style={s.header}>
        <Text style={s.h1}>Tasks</Text>
        <View style={s.headerActions}>
          <Pressable
            onPress={async () => {
              try {
                const { getAllTasks, getPendingTasks } =
                  await require('../../../Model/TaskModel/sqliteService');
                const rows: any = await getAllTasks();
                const pending: any = await getPendingTasks();
                console.log('[DEBUG] getAllTasks', rows);
                console.log('[DEBUG] getPendingTasks', pending);
                ToastMessage.TOAST_SHORT_BOTTOM(
                  `rows=${rows.length} pending=${pending.length}`,
                );
              } catch (err) {
                console.warn('dump db failed', err);
                ToastMessage.TOAST_SHORT_BOTTOM('dump db failed');
              }
            }}
            style={[s.addBtn, s.dumpBtn]}
          >
            <Text style={s.addBtnText}>Dump DB</Text>
          </Pressable>
          <Pressable onPress={() => setModalVisible(true)} style={s.addBtn}>
            <Text style={s.addBtnText}>+ Add</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              try {
                await displayImmediateNotification(
                  'Test',
                  'Immediate test notification',
                );
                ToastMessage.TOAST_SHORT_BOTTOM('Test notification attempted');
              } catch (e) {
                console.warn('test notification failed', e);
                ToastMessage.TOAST_SHORT_BOTTOM('Test notification failed');
              }
            }}
            style={[s.addBtn, s.testBtn]}
          >
            <Text style={s.addBtnText}>Test Noti</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={visibleData}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRetry={handleRetry}
            isSyncing={!!syncing[item.id]}
            onMeasure={onMeasure}
            onLocalReminder={handleLocalReminder}
            onSendPush={handleSendPush}
          />
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews
        updateCellsBatchingPeriod={50}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        getItemLayout={(_, index) => {
          const defaultH = getItemHeight(figmaH);
          let offset = 0;
          for (let i = 0; i < index; i++) {
            const id = visibleData[i]?.id;
            offset += id && heightMap[id] ? heightMap[id] : defaultH;
          }
          const id = visibleData[index]?.id;
          const length = id && heightMap[id] ? heightMap[id] : defaultH;
          return { length, offset, index };
        }}
        ListFooterComponent={
          visibleData.length < tasks.length ? FooterLoading : null
        }
      />
      <AddEditTaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditing(null);
        }}
        onSave={onSave}
        task={editing}
      />
    </View>
  );
};

const FooterLoading = () => {
  const { wp, hp, figmaH, figmaW } = useOrientation();
  const colors = useColor();
  const s = taskStyles(wp, hp, figmaW, figmaH, colors);
  return (
    <View style={s.footer}>
      <LoadingSpinner size={24} />
    </View>
  );
};

const taskStyles = (
  wp: (v: number) => number,
  hp: (v: number) => number,
  figmaW: (v: number) => number,
  figmaH: (v: number) => number,
  colors: any,
) =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: colors?.background ?? '#fff' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: figmaW(12),
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    h1: {
      fontSize: figmaW(20),
      fontWeight: '700' as any,
      color: colors?.text ?? '#000',
    },
    addBtn: {
      padding: figmaW(8),
      backgroundColor: colors?.primary ?? '#FF4081',
      borderRadius: figmaW(6),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: figmaW(12),
    },
    addBtnText: {
      color: colors?.background ?? '#fff',
      fontWeight: '600' as any,
    },
    debugBtn: {
      marginRight: figmaW(8),
      backgroundColor: '#6cf',
    },
    testBtn: {
      marginLeft: figmaW(8),
      backgroundColor: '#6c6',
    },
    dumpBtn: {
      marginRight: figmaW(8),
      backgroundColor: '#888',
    },
    footer: { paddingVertical: figmaH(12), paddingHorizontal: figmaW(12) },
  });

export default TasksScreen;
