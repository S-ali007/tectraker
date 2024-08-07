"use client";

import React from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const path = usePathname();

  // React.useEffect(() => {
  //   if (!isAuthenticated && path !== "/verifyemail" && path !== "/signup") {
  //     router.push("/login");
  //   }
  // }, [isAuthenticated, path, router]);

  if (!isAuthenticated && (path === "/verifyemail" || path === "/signup")) {
    // return router.push("/login");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
