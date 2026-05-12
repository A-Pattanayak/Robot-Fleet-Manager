import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isAuthLoading: true,
  },
  reducers: {
    addUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthLoading = false;
    },
    removeUser: (state) => {
      state.currentUser = null;
      state.isAuthLoading = false;
    },
  },
});

export default userSlice.reducer;
export const { addUser, removeUser } = userSlice.actions;
