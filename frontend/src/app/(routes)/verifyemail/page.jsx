"use client";

import api from "@/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { verifyEmail } from "@/app/features/authSlice";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

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
        try {
          const response = await api.post("/api/v1/users/verifyemail", {
            token,
          });
          dispatch(verifyEmail(response.data.user));
          setVerified(true);
          toast.success("Email verified successfully");
          router.push("/projects?tab=active&sortBy=name&sortOrder=asc");
        } catch (error) {
          console.error("Verification failed:", error);
          toast.error(error?.response?.data?.errors || "Verification failed");
          setError(true);
          router.push("/login");
        }
      };

      verifyUserEmail();
    }
  }, [token, dispatch, router]);

  return null;
}
