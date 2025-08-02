"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";

export const Navbar = () => {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/users/logout`,
        {},
        { withCredentials: true }
      );
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 ">
      <div className="flex justify-between items-center py-3 px-4">
        <Link href="/">
          <img src="/logo1.webp" className="w-25"></img>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-6">
          {loading ? (
            <div className="w-48 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          ) : user ? (
            <>
              <Link href={`/profile/${user.id}`}>
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="font-semibold text-gray-700 group-hover:text-blue-600 hidden sm:flex">
                    My Profile
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-400 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <span className="font-semibold text-gray-700 hover:text-blue-600 cursor-pointer">
                  Login
                </span>
              </Link>
              <Link href="/auth/signup">
                <span className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
