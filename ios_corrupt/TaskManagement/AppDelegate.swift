import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UserNotifications
import Firebase
import FirebaseMessaging

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Configure Firebase (requires GoogleService-Info.plist added to the Xcode project)
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
      print("[firebase] configured")
    }

    // Register for remote notifications
    UNUserNotificationCenter.current().delegate = self
    UNUserNotificationCenter.current()
      .requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
        if let err = error {
          print("[notifications] requestAuthorization error:", err)
        } else {
          print("[notifications] permission granted:", granted)
        }
        DispatchQueue.main.async {
          UIApplication.shared.registerForRemoteNotifications()
        }
      }

    // Ensure Firebase Messaging delegates are set
    Messaging.messaging().delegate = self as? MessagingDelegate

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "TaskManagement",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // MARK: - APNs registration
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    print("[notifications] didRegisterForRemoteNotificationsWithDeviceToken")
    // Pass device token to Firebase Messaging
    Messaging.messaging().apnsToken = deviceToken
  }

  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("[notifications] didFailToRegisterForRemoteNotificationsWithError", error)
  }

  // MARK: - UNUserNotificationCenterDelegate
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    // Show notifications while app is in foreground
    completionHandler([.banner, .sound, .badge])
  }

  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    // Handle notification tap
    completionHandler()
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
