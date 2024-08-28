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
          const response = await api.post("/api/v1/users/verifyemail", { token });
          dispatch(verifyEmail(response.data.user));
          setVerified(true);
          toast.success("Email verified successfully");
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

  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 text-black">{token ? `Token: ${token}` : "No token"}</h2>

      {verified && (
        <div className="flex flex-col w-full justify-center items-center mt-5 gap-5">
          <h2 className="text-2xl">Email Verified Successfully</h2>
          <Link className="text-2xl underline" href="/login">
            Login
          </Link>
        </div>
      )}
      {error && (
        <div className="flex flex-col w-full justify-center items-center mt-5 gap-5">
          <h2 className="text-2xl text-red-500">Verification Error</h2>
        </div>
      )}
    </div>
  );
}
