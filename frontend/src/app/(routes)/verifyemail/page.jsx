"use client";

import api from "@/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { verifyEmail } from "@/app/features/authSlice";
import Cookies from "js-cookie";
import Loader from "./loading";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenFromParams = params.get("token");
    if (tokenFromParams) {
      setToken(tokenFromParams);
    } else {
      router.push("/signup");
    }
  }, [params, router]);

  useEffect(() => {
    if (token) {
      const verifyUserEmail = async () => {
        setLoading(true);
        try {
          const response = await api.post("/api/v1/users/verifyemail", {
            token,
          });
          dispatch(verifyEmail(response.data.user));
          setVerified(true);
          Cookies.set("accessToken", response.data.data.accessToken);
          toast.success("Email verified successfully");
          setRedirectPath("/projects?tab=active&sortBy=name&sortOrder=asc");
        } catch (error) {
          console.error("Verification failed:", error);
          toast.error(error?.response?.data?.errors || "Verification failed");
          setError(true);
          setRedirectPath("/login");
        } finally {
          setLoading(false);
        }
      };

      verifyUserEmail();
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (redirectPath) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      {loading && <Loader />}
    </div>
  );
}
