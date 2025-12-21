# sendTestNotification.js

Simple helper to send a test FCM notification using the Firebase Admin SDK.

Usage examples:

1. Using a service account JSON file passed directly:

```
node tools/sendTestNotification.js --token <DEVICE_TOKEN> --title "Hi" --body "Hello" --serviceAccount ./serviceAccount.json
```

2. Using GOOGLE_APPLICATION_CREDENTIALS env var:

```
export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
node tools/sendTestNotification.js --token <DEVICE_TOKEN> --title "Hi" --body "Hello"
```

The script will print the message id on success or an error on failure.
