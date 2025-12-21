import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { JSX, Suspense, useEffect } from 'react';
import { useInterceptor } from '../../Controller/Services/useInterceptor';
import { startNetworkListener } from '../../Model/TaskModel/networkSync';
import { loadTasks } from '../../Model/TaskModel/taskSlice';
import LoadingSpinner from '../../View/Components/LoadingSpinner';
import { useAppDispatch } from '../Redux/Store/Store';
import { ScreenParamList, Screens } from './screenTypes';
const Splash = React.lazy(() => import('../../View/Screens/1.Splash/Splash'));
const Signin = React.lazy(() => import('../../View/Screens/3.Auth/Signin'));
const Signup = React.lazy(() => import('../../View/Screens/3.Auth/Signup'));
const Bottomnavigation = React.lazy(
  () => import('./BottomNavigation/Bottomnavigation'),
);
const Stack = createNativeStackNavigator<ScreenParamList>();

export const StackNavigation = (): JSX.Element => {
  useInterceptor();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTasks());
    // start network sync listener
    startNetworkListener();
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Stack.Navigator
        initialRouteName={Screens.Splash}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name={Screens.Splash} component={Splash as any} />

        <Stack.Screen name={Screens.Signup} component={Signup as any} />
        <Stack.Screen name={Screens.Signin} component={Signin as any} />

        <Stack.Screen
          name={Screens.Bottomnavigation}
          component={Bottomnavigation as any}
        />
      </Stack.Navigator>
    </Suspense>
  );
};
