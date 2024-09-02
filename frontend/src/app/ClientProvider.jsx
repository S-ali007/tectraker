"use client";

import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store";

import LandingPage from "./components/common/LandingPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import { usePathname } from "next/navigation";

const ClientProvider = ({ children }) => {
  const path = usePathname();

  return (
    <Provider store={store}>
      <ProtectedRoute>
        <LandingPage />
        <div className=" w-full flex">{children}</div>
      </ProtectedRoute>
    </Provider>
  );
};

export default ClientProvider;
