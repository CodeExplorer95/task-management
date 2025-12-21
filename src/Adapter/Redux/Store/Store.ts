import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import tasksReducer from '../../../../src/Model/TaskModel/taskSlice';
import themeReducer from '../../../Controller/Theme/themeSlice';

const appReducer = combineReducers({
  theme: themeReducer,
  tasks: tasksReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme'], // persist only theme slice
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const rootReducer: Reducer = (state: RootState, action) => {
  if (action.type === 'resetRedux/resetReduxState') {
    state = {} as RootState;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      // allow redux-persist actions through serialization checks
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appReducer>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// convenience typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
