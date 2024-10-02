import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id:String
  username: string;
  email: string;
  contact: string;
  profilePic: string;
}

interface AuthState {
  user: User | null; // Directly represent the user object here
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    clearUser(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    
    updateUserProfile(state, action: PayloadAction<User>) {
      state.user = action.payload; 
    },
  },
});

export const { setUser, clearUser, setLoading, setError, clearError, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;
