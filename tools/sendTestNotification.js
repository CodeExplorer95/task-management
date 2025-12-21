/*
Simple test sender using firebase-admin.
Usage:
  node tools/sendTestNotification.js --token <DEVICE_TOKEN> --title "Hi" --body "Hello" [--serviceAccount ./sa.json]

Environment:
  - Either set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON file
  - Or pass --serviceAccount ./path/to/serviceAccount.json

This script sends a single notification to the supplied device token using the Admin SDK.
*/

const admin = require('firebase-admin');
const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--token') out.token = args[++i];
    else if (a === '--title') out.title = args[++i];
    else if (a === '--body') out.body = args[++i];
    else if (a === '--serviceAccount') out.serviceAccount = args[++i];
  }
  return out;
}

async function main() {
  const { token, title = 'Test', body = 'Hello', serviceAccount } = parseArgs();
  if (!token) {
    console.error('Usage: node tools/sendTestNotification.js --token <DEVICE_TOKEN> [--title ".."] [--body ".."] [--serviceAccount ./sa.json]');
    process.exit(2);
  }

  try {
    if (serviceAccount) {
      if (!fs.existsSync(serviceAccount)) {
        console.error('serviceAccount file not found:', serviceAccount);
        process.exit(2);
      }
      const sa = require(require('path').resolve(serviceAccount));
      admin.initializeApp({ credential: admin.credential.cert(sa) });
    } else {
      // If GOOGLE_APPLICATION_CREDENTIALS is set, admin will use it automatically.
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.error('No service account provided and GOOGLE_APPLICATION_CREDENTIALS not set.');
        process.exit(2);
      }
      admin.initializeApp();
    }

    const message = {
      token,
      notification: {
        title,
        body,
      },
      android: {
        priority: 'high',
      },
      apns: {
        headers: { 'apns-priority': '10' },
      },
    };

    const resp = await admin.messaging().send(message);
    console.log('Message sent, id=', resp);
    process.exit(0);
  } catch (e) {
    console.error('send error', e);
    process.exit(1);
  }
}

main();
