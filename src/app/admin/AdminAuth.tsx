"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "portfolio_admin_token";

type Ctx = {
  token: string | null;
  setToken: (t: string | null) => void;
};

const AdminAuthContext = createContext<Ctx>({ token: null, setToken: () => {} });

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setTokenState(stored);
    setHydrated(true);
  }, []);

  const setToken = (t: string | null) => {
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem(STORAGE_KEY, t);
      else localStorage.removeItem(STORAGE_KEY);
    }
    setTokenState(t);
  };

  if (!hydrated) return null;

  return (
    <AdminAuthContext.Provider value={{ token, setToken }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
