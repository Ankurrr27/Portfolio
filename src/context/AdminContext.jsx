"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authInitialized = React.useRef(false);

  useEffect(() => {
    if (authInitialized.current) return;
    authInitialized.current = true;

    const savedKey = window.localStorage.getItem("portfolio_admin_key");
    if (savedKey) {
      setAdminKey(savedKey);
      checkAuth(savedKey);
    } else {
      setIsLoading(false);
    }
  }, []);


  const checkAuth = async (key) => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
      });
      if (response.ok) {
        setIsAuthorized(true);
        window.localStorage.setItem("portfolio_admin_key", key);
      } else {
        setIsAuthorized(false);
        window.localStorage.removeItem("portfolio_admin_key");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (key) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
      });
      if (response.ok) {
        setAdminKey(key);
        setIsAuthorized(true);
        window.localStorage.setItem("portfolio_admin_key", key);
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || "Invalid key" };
      }
    } catch (error) {
      return { success: false, error: "Connection error" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdminKey("");
    setIsAuthorized(false);
    window.localStorage.removeItem("portfolio_admin_key");
  };

  return (
    <AdminContext.Provider
      value={{
        adminKey,
        isAuthorized,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
