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
        <div className="mx-auto max-w-[1630px] w-full flex">
          <LandingPage />
          {children}
        </div>
      </ProtectedRoute>
    </Provider>
  );
};

export default ClientProvider;
