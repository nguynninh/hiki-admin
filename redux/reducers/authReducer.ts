import { createSlice } from "@reduxjs/toolkit";
import { localDataNames } from "../../constants/appInfos";

export interface AuthState {
  id: string;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

const initialState = {
  id: "",
  access_token: "",
  refresh_token: "",
  expires_in: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.data = action.payload;
      syncLocal(action.payload);
    },
    removeAuth: (state) => {
      state.data = initialState;
      syncLocal({});
    },
  },
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;

export const authSelector = (state: any): AuthState => state.authReducer.data;

const syncLocal = (data: any) => {
  localStorage.setItem(localDataNames.authData, JSON.stringify(data));
};
