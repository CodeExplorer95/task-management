import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from '@react-native-firebase/firestore';

const COLLECTION = 'tasks';

function safeId(id: string | undefined) {
  return id ?? 'unknown-id';
}

export async function upsertTaskToFirestore(task: any) {
  const auth = getAuth(getApp());
  const uid = auth.currentUser?.uid ?? null;
  if (!uid) {
    console.error('[firestore] upsertTask: no authenticated user, aborting', {
      id: task?.id,
    });
    throw new Error('not_authenticated: user must be signed in to write tasks');
  }
  const db = getFirestore(getApp());
  const colRef = collection(db, COLLECTION);
  const ref = doc(colRef, safeId(task.id));

  const payload: any = {
    title: task.title,
    notes: task.notes ?? null,
    completed: !!task.completed,
    reminderAt: task.reminderAt ?? null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt ?? task.createdAt,
  };

  if (uid) payload.owner = uid;

  try {
    console.log('firestore upsertTask', { id: task.id, uid, payload });
    await setDoc(ref, payload, { merge: true });
    console.log('firestore upsertTask SUCCESS', { id: task.id });
  } catch (err: any) {
    // log full error for debugging, then throw a cleaner error message
    console.error('firestore upsertTask ERROR', { id: task.id, err });
    const message = err?.message ?? String(err);
    throw new Error(`firestore_upsert_failed: ${message}`);
  }
}

export async function deleteTaskFromFirestore(id: string) {
  const auth = getAuth(getApp());
  const uid = auth.currentUser?.uid ?? null;
  if (!uid) {
    console.error('[firestore] deleteTask: no authenticated user, aborting', {
      id,
    });
    throw new Error(
      'not_authenticated: user must be signed in to delete tasks',
    );
  }
  const db = getFirestore(getApp());
  const ref = doc(collection(db, COLLECTION), safeId(id));

  try {
    console.log('[firestore] deleteTask', { id, uid });
    await deleteDoc(ref);
    console.log('[firestore] deleteTask SUCCESS', { id });
  } catch (err: any) {
    console.error('[firestore] deleteTask ERROR', { id, err });
    const message = err?.message ?? String(err);
    throw new Error(`firestore_delete_failed: ${message}`);
  }
}
