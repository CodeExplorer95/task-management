
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

async function ensureChannel() {
  try {
    if (notifee && typeof notifee.createChannel === 'function') {
      await notifee.createChannel({ id: 'task-reminders', name: 'Task Reminders' });
    } else if (notifee && notifee.android && typeof notifee.android.createChannel === 'function') {
      await notifee.android.createChannel({ id: 'task-reminders', name: 'Task Reminders' });
    }
  } catch (e) {
    console.warn('ensureChannel failed', e);
  }
}

async function displayRemoteNotification(remoteMessage) {
  try {
    if (!remoteMessage) return;
    const title = remoteMessage.notification?.title ?? remoteMessage.data?.title;
    const body = remoteMessage.notification?.body ?? remoteMessage.data?.body;
    await ensureChannel();
    if (notifee && typeof notifee.displayNotification === 'function') {
      await notifee.displayNotification({
        title,
        body,
        android: { channelId: 'task-reminders' },
      });
    }
  } catch (e) {
    console.warn('displayRemoteNotification error', e);
  }
}

messaging().onMessage(async remoteMessage => {
  await displayRemoteNotification(remoteMessage);
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await displayRemoteNotification(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
