import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import robotReducer from './robotSlice'

const appStore = configureStore({
  reducer: {
    user: userReducer,
    robots: robotReducer
  },
});

export default appStore;
