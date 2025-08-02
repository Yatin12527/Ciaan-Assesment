"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toast } from "primereact/toast";
import Link from "next/link";

type LoginFormInputs = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [showpass, setshowpass] = useState(false);
  const toast = useRef<Toast>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_SERVER 
        }/users/login`,
        data,
        { withCredentials: true }
      );

      toast.current?.show({
        severity: "success",
        summary: "Login Success",
        detail: "Successfully logged in",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error: any) {
      const message =
        error.response?.status === 401
          ? "Wrong credentials. Please try again."
          : "An unexpected error occurred.";
      toast.current?.show({
        severity: "error",
        summary: "Login Error",
        detail: message,
      });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Toast ref={toast} />
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Community
          </h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl">
          <div className="text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-500 mt-1">
              Stay updated on your professional world
            </p>
          </div>

          <form
            className="flex flex-col gap-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  {...register("username", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              <span className="text-red-500 text-sm h-5 block">
                {errors.username?.message || ""}
              </span>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showpass ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Password"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setshowpass((prev) => !prev)}
                >
                  {showpass ? (
                    <FaEyeSlash className="text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-600" />
                  )}
                </div>
              </div>
              <span className="text-red-500 text-sm h-5 block">
                {errors.password?.message || ""}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-4 py-3 font-semibold mt-4 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Sign in
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              className="flex items-center justify-center gap-3 w-full p-3 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-full shadow-sm cursor-pointer"
              onClick={() =>
                (window.location.href = `${
                  process.env.NEXT_PUBLIC_SERVER 
                }/users/google`)
              }
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              <span className="font-medium text-sm">Continue with Google</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">New to Community? </span>
          <Link
            href="/auth/signup"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Join now
          </Link>
        </div>
      </div>
    </main>
  );
}
