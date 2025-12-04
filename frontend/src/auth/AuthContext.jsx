import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Keep token in state; seed from localStorage for persistence across refreshes.
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (accessToken, userData = null) => {
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const value = { token, user, login, logout, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Convenience hook for components.
export const useAuth = () => useContext(AuthContext);
