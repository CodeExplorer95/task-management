import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

async function saveDeviceToken(token: string | null) {
  if (!token) return;
  try {
    const { getApp } = require('@react-native-firebase/app');
    const {
      getFirestore,
      collection,
      doc,
      setDoc,
    } = require('@react-native-firebase/firestore');
    const { getAuth } = require('@react-native-firebase/auth');
    const uid = getAuth(getApp()).currentUser?.uid ?? null;
    const db = getFirestore(getApp());
    const col = collection(db, 'deviceTokens');
    const ref = doc(col, token);
    await setDoc(
      ref,
      { token, owner: uid, createdAt: Date.now() },
      { merge: true },
    );
    console.log('Saved device token to Firestore');
  } catch (e) {
    console.warn('saveDeviceToken failed', e);
  }
}

export async function createDefaultChannel() {
  await notifee.createChannel({
    id: 'task-reminders',
    name: 'Task Reminders',
    importance: AndroidImportance.HIGH,
  });
}
// flexible schedule: accept either (taskObj) or (title, body, triggerTime)
export async function scheduleTaskReminder(
  arg1: any,
  arg2?: string,
  arg3?: number,
) {
  let title: string | undefined;
  let body: string | undefined;
  let triggerTime: number | undefined;
  let id: string | undefined;

  if (typeof arg1 === 'object' && arg1 !== null) {
    const task = arg1 as any;
    id = task.id;
    title = task.title;
    body = task.notes ?? undefined;
    triggerTime = task.reminderAt as number | undefined;
  } else {
    title = arg1 as string;
    body = arg2;
    triggerTime = arg3;
  }

  if (!triggerTime || triggerTime <= Date.now()) return null;

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerTime,
  };

  // ensure channel exists
  try {
    await createDefaultChannel();
  } catch (e) {
    // ignore
  }

  const notifPayload: any = {
    title,
    body,
    android: {
      channelId: 'task-reminders',
      pressAction: { id: 'default' },
      smallIcon: 'ic_notification',
      sound: 'default',
    },
  };
  if (id) notifPayload.id = `task-${id}`;

  try {
    const notificationId = await notifee.createTriggerNotification(
      notifPayload,
      trigger,
    );
    return notificationId;
  } catch (e) {
    console.warn('createTriggerNotification failed', e);
    return null;
  }
}

export async function cancelTaskReminder(taskId: string) {
  try {
    const id = `task-${taskId}`;
    if (typeof notifee.cancelTriggerNotification === 'function') {
      await notifee.cancelTriggerNotification(id);
    }
    if (typeof notifee.cancelNotification === 'function') {
      await notifee.cancelNotification(id);
    }
  } catch (e) {
    console.warn('cancelTaskReminder failed', e);
  }

  return;
}

export async function initNotifications() {
  try {
    await createDefaultChannel();
  } catch (e) {}
  try {
    await requestPermission();
  } catch (e) {}
  try {
    await getFCMToken();
  } catch (e) {}
}

export async function displayImmediateNotification(
  title: string,
  body?: string,
) {
  try {
    await createDefaultChannel();
  } catch (e) {}
  try {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'task-reminders',
        smallIcon: 'ic_notification',
        sound: 'default',
      },
    });
  } catch (e) {
    console.warn('displayImmediateNotification failed', e);
  }
}

export async function requestPermission() {
  try {
    if (Platform.OS === 'android') {
      // Android 13+ requires POST_NOTIFICATIONS at runtime
      const sdk = Number(Platform.Version) || 0;
      if (sdk >= 33) {
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        const granted = res === PermissionsAndroid.RESULTS.GRANTED;
        console.log('Android POST_NOTIFICATIONS granted:', granted);
        return granted;
      }
      // older Android versions don't require runtime permission
      return true;
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('iOS Permission:', enabled);
      return enabled;
    }
  } catch (e) {
    console.warn('requestPermission failed', e);
    return false;
  }
}

export async function getFCMToken() {
  const token = await messaging().getToken();
  console.log('FCM TOKEN:', token);

  await saveDeviceToken(token);

  if (typeof messaging().onTokenRefresh === 'function') {
    messaging().onTokenRefresh(async (newToken: string) => {
      console.log('FCM token refreshed', newToken);
      await saveDeviceToken(newToken);
    });
  }
}
