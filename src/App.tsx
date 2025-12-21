import { JSX, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NavigationContainers from './Adapter/Navigation/NavigationContainers';
import {
  createDefaultChannel,
  requestPermission,
} from './Adapter/Notifications/notificationService';
import { persistor, store } from './Adapter/Redux/Store/Store';

function App(): JSX.Element {
  useEffect(() => {
    createDefaultChannel();
    requestPermission();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainers />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
