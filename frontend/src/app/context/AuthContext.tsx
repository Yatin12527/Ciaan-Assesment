"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  username: string;
  picture: string;
  bio: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      console.log(
        "Fetching user from:",
        `${process.env.NEXT_PUBLIC_SERVER}/users/me`
      );
      const response = await axios.get<User>(
        `${process.env.NEXT_PUBLIC_SERVER}/users/me`,
        { withCredentials: true }
      );
      console.log("User fetched successfully:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Not authenticated:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const checkForOAuthReturn = () => {
      if (window.location.pathname === "/" && !user && !loading) {
        console.log("Possible OAuth return detected, refetching user...");
        fetchUser();
      }
    };
    const timer = setTimeout(checkForOAuthReturn, 1000);
    return () => clearTimeout(timer);
  }, [user, loading]);

  const value = { user, setUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("use within an authprovider");
  }
  return context;
};
