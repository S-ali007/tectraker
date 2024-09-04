"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TypeWriterComponent from "@/app/components/TypeWriter";
import api from "@/api";

export default function SignupPage() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (user.email === "" || user.password === "" || user.username === "") {
      toast.error("All fields are required!");
      return;
    }
    if (user.email.trim() && emailRegex.test(user.email)) {
      setLoading(true);
      try {
        const response = await api.post("/api/v1/users/register", user);

        toast.success("Check Your Email To Verify");
        // console.log("Signup success", response.data);

        // router.push("/login");
      } catch (error) {
        // console.log("Signup failed", error.message, error.response.data.error);
        toast.error(error?.response?.data?.errors);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Invalid email format ");
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <>
      <div className="w-full bg-[#3863a3] ">
        <div className=" w-full pt-[150px] mx-auto flex">
          <img src="/logo.png" alt="" className="animate-ring" />
          <div>
            <h1 className="w-full text-[65px] leading-[50px] font-[700] text-[#fff]">
              <TypeWriterComponent text={"Tech Tracker "} />
            </h1>

            {/* <TypeWriterComponent text={"Lets Track Your Work "} duration={10} /> */}
          </div>
        </div>
      </div>
      <div className="max-w-[514px] w-full flex flex-col justify-center min-h-screen mx-auto px-[50px]">
        <h1 className="text-[64px] font-[700]">Signup</h1>

        <label htmlFor="username" className="text-[gray]">
          Username
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="username"
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Username"
        />
        <label htmlFor="email" className="text-[gray]">
          Email
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="email"
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
        <label htmlFor="password" className="text-[gray]">
          Password
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-gray-700"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
        />
        <button
          onClick={onSignup}
          className={`${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 hover:scale-105 font-proximaNova hover:opacity-90 transition-all duration-100 ease-linear"
          } bg-[#00C386] mx-auto max-w-[204px] px-[10px] text-[13px] leading-[16px] py-[10px] rounded-[5px] text-white w-full font-[600]`}
          disabled={loading}
        >
          {loading ? "Signing..." : "Sign Up"}
        </button>
        <div>
          <div className="w-full flex justify-center font-[700]">OR </div>
          <div className="w-full  flex justify-center mt-[20px] gap-[10px]">
            {" "}
            <span>have account</span>{" "}
            <Link className="font-[700] underline" href="/login">
              Log In
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
