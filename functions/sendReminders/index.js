

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.sendReminders = functions.https.onRequest(async (req, res) => {
  try {
    const now = Date.now();
    const tasksSnap = await db.collection('tasks').where('reminderAt', '<=', now).get();
    if (tasksSnap.empty) {
      res.status(200).send('No due reminders');
      return;
    }

    const tokensSnap = await db.collection('deviceTokens').get();
    const tokens = tokensSnap.docs.map(d => d.id).filter(Boolean);
    if (!tokens.length) {
      res.status(200).send('No device tokens');
      return;
    }

    const messages = [];
    tasksSnap.forEach(doc => {
      const t = doc.data();
      const title = t.title || 'Reminder';
      const body = t.notes || '';
      messages.push(...tokens.map(token => ({ token, notification: { title, body }, data: { taskId: doc.id } })));
    });

    // Send in batches
    const BATCH = 500; // FCM batch limit
    for (let i = 0; i < messages.length; i += BATCH) {
      const batch = messages.slice(i, i + BATCH);
      const resp = await admin.messaging().sendAll(batch);
      console.log('batch send result', resp.successCount, resp.failureCount);
    }

    res.status(200).send('Reminders processed');
  } catch (e) {
    console.error('sendReminders error', e);
    res.status(500).send('error');
  }
});
