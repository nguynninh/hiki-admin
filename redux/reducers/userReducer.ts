import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const initialState: UserState = {
  id: "",
  email: "",
  firstname: "",
  lastname: "",
  created_at: "",
  updated_at: "",
  deleted_at: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: initialState,
  },
  reducers: {
    addUser: (state, action) => {
      state.data = action.payload;
    },
    removeUser: (state) => {
      state.data = initialState;
    },
  },
});

export const userReducer = userSlice.reducer;
export const { addUser, removeUser } = userSlice.actions;

export const userSelector = (state: any) => state.userReducer.data;