import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './slices/authSlice';

const loadState = (): { auth: AuthState } | undefined => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (!serializedState) return undefined; 
    return { auth: JSON.parse(serializedState) }; 
  } catch (error) {
    console.error('Could not load state', error);
    return undefined;
  }
};

const saveState = (state: { auth: AuthState }) => {
  try {
    const serializedState = JSON.stringify(state.auth);
    localStorage.setItem('authState', serializedState);
  } catch (error) {
    console.error('Could not save state', error);
  }
};

const persistedState = loadState();

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: persistedState, 
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
