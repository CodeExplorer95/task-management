// -----------------------SCREENS-------------------------------
export enum Screens {
  Splash = 'Splash',
  Signin = 'Signin',
  Signup = 'Signup',
  Profile = 'Profile',
  Bottomnavigation = 'Bottomnavigation',
  Tasks = 'Tasks',
  Settings = 'Settings',
}
export type ScreenParamList = {
  [Screens.Splash]: undefined; // undefined because there is no data passed through Routes.Params //

  [Screens.Signin]: undefined; // undefined because there is no data passed through Routes.Params //
  [Screens.Signup]: undefined; // undefined because there is no data passed through Routes.Params //

  [Screens.Bottomnavigation]: undefined;
  [Screens.Profile]: undefined;

  [Screens.Tasks]: undefined;
  [Screens.Settings]: undefined;
};
