import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DB_NAME = 'taskman.db';

let db: any = null;

async function openDB() {
  if (db) return db;
  try {
    console.log('[sqlite] opening DB', DB_NAME);
    db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
    console.log('[sqlite] DB opened');
    await initDB();
    return db;
  } catch (err) {
    console.error('[sqlite] openDB failed', err);
    throw err;
  }
}

async function initDB() {
  const d = await db!;
  try {
    console.log('[sqlite] initDB: creating tasks table if not exists');
    const res = await d.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      notes TEXT,
  completed INTEGER,
  reminderAt INTEGER,
      createdAt INTEGER,
      updatedAt INTEGER,
      syncStatus TEXT
    );`,
    );
    console.log('[sqlite] initDB result', res);
    // runtime migration: ensure expected columns exist (for users upgrading old DBs)
    try {
      const [info] = await d.executeSql(`PRAGMA table_info(tasks);`);
      const existingCols: string[] = [];
      for (let i = 0; i < info.rows.length; i++)
        existingCols.push(info.rows.item(i).name);
      const expected = [
        { name: 'reminderAt', type: 'INTEGER' },
        { name: 'syncStatus', type: 'TEXT' },
        { name: 'updatedAt', type: 'INTEGER' },
      ];
      for (const col of expected) {
        if (!existingCols.includes(col.name)) {
          try {
            console.log('[sqlite] adding missing column', col.name);
            await d.executeSql(
              `ALTER TABLE tasks ADD COLUMN ${col.name} ${col.type};`,
            );
            console.log('[sqlite] added column', col.name);
          } catch (err) {
            console.warn('[sqlite] failed to add column', col.name, err);
          }
        }
      }
    } catch (err) {
      console.warn('[sqlite] migration check failed', err);
    }
  } catch (err) {
    console.error('[sqlite] initDB failed', err);
    throw err;
  }
}

export async function getAllTasks() {
  const d = await openDB();
  // exclude rows marked as deleted so UI doesn't show soft-deleted items
  try {
    const [res] = await d.executeSql(
      `SELECT * FROM tasks WHERE COALESCE(syncStatus, '') != 'deleted' ORDER BY createdAt DESC;`,
    );
    console.log('[sqlite] getAllTasks rows=', res.rows.length);
    const rows: any[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      const r = res.rows.item(i);
      rows.push({
        ...r,
        completed: !!r.completed,
        reminderAt: r.reminderAt === null ? null : Number(r.reminderAt),
      });
    }
    return rows;
  } catch (err) {
    console.error('[sqlite] getAllTasks failed', err);
    throw err;
  }
}

export async function insertTask(task: any) {
  const d = await openDB();
  try {
    console.log('[sqlite] insertTask:', task.id, task.title);
    const res = await d.executeSql(
      `INSERT OR REPLACE INTO tasks (id,title,notes,completed,reminderAt,createdAt,updatedAt,syncStatus) VALUES (?,?,?,?,?,?,?,?);`,
      [
        task.id,
        task.title,
        task.notes ?? null,
        task.completed ? 1 : 0,
        task.reminderAt ?? null,
        task.createdAt,
        task.updatedAt ?? task.createdAt,
        task.syncStatus ?? 'pending',
      ],
    );
    console.log('[sqlite] insertTask result', res);
    try {
      const [check] = await d.executeSql(
        `SELECT id FROM tasks WHERE id = ? LIMIT 1;`,
        [task.id],
      );
      if (!check || check.rows.length === 0) {
        console.error(
          '[sqlite] insertTask verification failed, row missing after insert',
          task.id,
        );
        throw new Error('insert_not_persisted');
      }
      console.log('[sqlite] insertTask verified persisted id=', task.id);
    } catch (err) {
      console.error('[sqlite] insertTask verification error', err);
      throw err;
    }
    return res;
  } catch (err) {
    console.error('[sqlite] insertTask failed', err);
    throw err;
  }
}

export async function updateTaskDB(id: string, patch: any) {
  const d = await openDB();
  const fields: string[] = [];
  const vals: any[] = [];

  if (patch.title !== undefined) {
    fields.push('title=?');
    vals.push(patch.title);
  }
  if (patch.notes !== undefined) {
    fields.push('notes=?');
    vals.push(patch.notes);
  }
  if (patch.completed !== undefined) {
    fields.push('completed=?');
    vals.push(patch.completed ? 1 : 0);
  }
  if (patch.updatedAt !== undefined) {
    fields.push('updatedAt=?');
    vals.push(patch.updatedAt);
  }
  if (patch.reminderAt !== undefined) {
    fields.push('reminderAt=?');
    vals.push(patch.reminderAt);
  }
  if (patch.syncStatus !== undefined) {
    fields.push('syncStatus=?');
    vals.push(patch.syncStatus);
  }

  if (!fields.length) return;
  vals.push(id);
  try {
    console.log(
      '[sqlite] updateTaskDB sql=',
      `UPDATE tasks SET ${fields.join(',')} WHERE id=?;`,
      'vals=',
      vals,
    );
    const res = await d.executeSql(
      `UPDATE tasks SET ${fields.join(',')} WHERE id=?;`,
      vals,
    );
    console.log('[sqlite] updateTaskDB result', res);
    return res;
  } catch (err) {
    console.error('[sqlite] updateTaskDB failed', err);
    throw err;
  }
}

export async function deleteTaskDB(id: string) {
  const d = await openDB();
  try {
    console.log('[sqlite] deleteTaskDB id=', id);
    const res = await d.executeSql(`DELETE FROM tasks WHERE id = ?;`, [id]);
    console.log('[sqlite] deleteTaskDB result', res);
    return res;
  } catch (err) {
    console.error('[sqlite] deleteTaskDB failed', err);
    throw err;
  }
}

export async function getPendingTasks() {
  const d = await openDB();
  try {
    const [res] = await d.executeSql(
      `SELECT * FROM tasks WHERE syncStatus IN ('pending','updated','deleted') ORDER BY createdAt ASC;`,
    );
    console.log('[sqlite] getPendingTasks rows=', res.rows.length);
    const rows: any[] = [];
    for (let i = 0; i < res.rows.length; i++) rows.push(res.rows.item(i));
    return rows;
  } catch (err) {
    console.error('[sqlite] getPendingTasks failed', err);
    throw err;
  }
}

export async function getTaskById(id: string) {
  const d = await openDB();
  try {
    const [res] = await d.executeSql(
      `SELECT * FROM tasks WHERE id = ? LIMIT 1;`,
      [id],
    );
    console.log('[sqlite] getTaskById result count=', res.rows.length);
    if (res.rows.length) {
      const r = res.rows.item(0);
      return {
        ...r,
        completed: !!r.completed,
        reminderAt: r.reminderAt === null ? null : Number(r.reminderAt),
      };
    }
    return null;
  } catch (err) {
    console.error('[sqlite] getTaskById failed', err);
    throw err;
  }
}

export async function markSynced(id: string) {
  await updateTaskDB(id, { syncStatus: 'synced', updatedAt: Date.now() });
}
