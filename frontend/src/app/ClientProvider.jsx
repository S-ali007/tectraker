"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

import LandingPage from "./components/common/LandingPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import { ThemeProvider } from "./components/ThemeProvider";

const ClientProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <ProtectedRoute>
        <ThemeProvider>
          <LandingPage />
          <div className=" w-full flex">{children}</div>
        </ThemeProvider>
      </ProtectedRoute>
    </Provider>
  );
};

export default ClientProvider;
