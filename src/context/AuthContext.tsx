import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = { 
  email: string;
  firstName?: string;
  lastName?: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  login: (email: string, password: string) => Promise<void> | void;
  signup: (email: string, password: string, userData?: { firstName: string; lastName: string }) => Promise<void> | void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "hg_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const login = (email: string, password?: string) => {
    const u = { email };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const signup = (email: string, password: string, userData?: { firstName: string; lastName: string }) => {
    const u = { 
      email,
      firstName: userData?.firstName,
      lastName: userData?.lastName
    };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
