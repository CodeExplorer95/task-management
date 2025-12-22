This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

■ Architecture choice------MVC

//This project doing in Reactnative cli

//React native version is 0.80.2

//Use sqlite-storage fore offline data storage

■ Libraries used --------------
"@notifee/react-native": "^9.1.8",
"@react-native-async-storage/async-storage": "^1.24.0",
"@react-native-community/checkbox": "^0.5.20",
"@react-native-community/netinfo": "^11.4.1",
"@react-native-community/slider": "^5.1.1",
"@react-native-firebase/app": "^23.5.0",
"@react-native-firebase/auth": "^23.5.0",
"@react-native-firebase/firestore": "^23.5.0",
"@react-native-firebase/messaging": "^23.7.0",
"@react-native-picker/picker": "^2.11.4",
"@react-navigation/bottom-tabs": "^7.8.7",
"@react-navigation/native": "^7.1.22",
"@react-navigation/native-stack": "^7.8.1",
"@react-spring/native": "^10.0.3",
"@reduxjs/toolkit": "^2.11.0",
"axios": "^1.13.2",
"eventemitter3": "^5.0.1",
"immer": "^11.0.1",
"lodash.debounce": "^4.0.8",
"lodash.throttle": "^4.1.1",
"react": "19.1.0",
"react-native": "0.80.2",
"react-native-country-picker-modal": "^2.0.0",
"react-native-gesture-handler": "^2.29.1",
"react-native-permissions": "^5.4.4",
"react-native-popup-menu": "^0.18.0",
"react-native-reanimated": "^4.1.5",
"react-native-responsive-screen": "^1.4.2",
"react-native-safe-area-context": "^5.6.2",
"react-native-screens": "^4.18.0",
"react-native-simple-toast": "^3.3.2",
"react-native-sqlite-storage": "^6.0.1",
"react-native-svg": "^15.15.1",
"react-native-worklets": "^0.6.1",
"react-redux": "^9.2.0",
"redux-logger": "^3.0.6",
"redux-persist": "^6.0.0",
"validator": "^13.15.23"

    ■ How to run the app in each environment
    for ANDROID  1.FIRST------ npm install --legacy-peer-deps
                 2.npx rect-native start  ---for metro server running
                 3. npx react-native run-android ---for run and build the app

//Also add validation

for ios 1.cd ios
pod install
2.npx react-native run-ios

// For firestore rules -----
rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /tasks/{taskId} {
allow create: if request.auth != null && request.resource.data.owner == request.auth.uid;
allow update, delete: if request.auth != null && resource.data.owner == request.auth.uid;
allow read: if request.auth != null && resource.data.owner == request.auth.uid;
}
}
}

// Dark theme toogle and logout present in setting

//ALL TASK DONE WHICH IS GIVEN IN ASSIGNMENT

//I dont have Macbook so i cannot able to setup for ios app and test the application..ios app setup isnot done

## iOS setup notes

This project includes Android notification and FCM wiring; to enable the same on iOS you must complete a few manual steps (requires a Mac/Xcode):

1. Add Firebase config

   - Download `GoogleService-Info.plist` from your Firebase console and add it to `ios/TaskManagement` in Xcode (Ensure it's included in the app target).

2. CocoaPods

   - cd ios && pod install

3. Enable Push Notifications

   - In Xcode, select the app target > Signing & Capabilities > add `Push Notifications` and `Background Modes` (check `Remote notifications`).

4. AppDelegate

   - The AppDelegate.swift in this repo configures Firebase and registers for remote notifications. Ensure it matches and that `Firebase` pods are installed.

5. Notifee & Local Notifications

   - Follow Notifee iOS installation docs: https://notifee.app/react-native/docs/installation

6. APNs Certificate / Key

   - Upload your APNs Auth Key to the Firebase Console (Project Settings -> Cloud Messaging) so Firebase can send notifications to APNs.

7. Run on device
   - Push notifications require a real device (not simulator) to test remote notifications.

If you want, I can try to automate some plist or project changes, but adding your `GoogleService-Info.plist` and enabling the capabilities must be done in Xcode on macOS.
