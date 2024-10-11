import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id:String
  username: string;
  email: string;
  contact: string;
  profilePic: string;
}

export interface AuthState {
  user: User | null; 
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
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
    updateUserProfile(state, action: PayloadAction<User>) {
      state.user = action.payload; 
    },
  },
});

export const { setUser, clearUser, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;
