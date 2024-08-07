"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TypeWriterComponent from "@/app/components/TypeWriter";
import api from "@/api";
import { login } from "@/app/features/authSlice";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const onLogin = async () => {
    try {
      const res = await api.post("/api/v1/users/login", user);

      if (res?.data?.data?.user?.isVerified === true) {
        const { user, accessToken } = res.data.data;
        localStorage.setItem("userData", JSON.stringify(res.data.data));
        document.cookie = `accessToken=${accessToken}`;

        dispatch(login({ user, token: accessToken }));

        toast.success("Login success");
        router.push("/projects?tab=active");
      } else {
        toast.error("Email not verified");
      }
    } catch (error) {
      console.log("Login failed", error);
      toast.error(
        error?.response?.data?.errors ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <>
      <div className="w-full bg-[#3863a3]">
        <div className="w-full pt-[150px] mx-auto flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Tech Tracker Logo"
            className="animate-ring"
          />
          <div>
            <h1 className="w-full text-[65px] leading-[50px] font-[700] text-[#fff]">
              <TypeWriterComponent text="Tech Tracker" />
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-[514px] w-full flex flex-col justify-center min-h-screen mx-auto px-[50px]">
        <h1 className="text-[64px] font-[700]">Log In</h1>

        <label htmlFor="email" className="text-gray-500">
          Email
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          aria-label="Email"
        />
        <label htmlFor="password" className="text-gray-500">
          Password
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-700"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
          aria-label="Password"
        />
        <button
          onClick={onLogin}
          className={`${
            buttonDisabled
              ? "opacity-50"
              : "opacity-100 hover:scale-105 font-proximaNova hover:opacity-90 transition-all duration-100 ease-linear"
          } bg-[#00C386] mx-auto max-w-[204px] px-[10px] text-[13px] leading-[16px] py-[10px] rounded-[5px] text-white w-full font-[600]`}
          disabled={buttonDisabled}
        >
          Log In
        </button>
        <div>
          <div className="w-full flex justify-center font-[700]">OR</div>
          <div className="w-full flex justify-center mt-[20px] gap-[10px]">
            <span>Don't have an account?</span>
            <Link className="font-[700] underline" href="/signup">
              Signup
            </Link>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
