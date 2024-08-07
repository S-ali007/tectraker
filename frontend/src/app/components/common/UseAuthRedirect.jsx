"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UseAuthRedirect = () => {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const isPublicPath =
      path == "/login" ||
      path == "/verifyemail" ||
      path == "/projects" ||
      path == "/reports" ||
      path == "my-activites" ||
      path == "web-tracker" ||
      path == "invoices" ||
      path == "/";

    if (isPublicPath && userData) {
      router.push("/projects?tab=active");
    } else if (isPublicPath && !userData) {
      router.push("/login");
    }
  }, [path]);
  return null;
};

export default UseAuthRedirect;
