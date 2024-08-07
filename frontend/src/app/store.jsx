import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./features/projectSlice";
import authSlice from "./features/authSlice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    auth: authSlice ,
  },
});
