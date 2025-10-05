import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const data = await loginService(userData);
      if (data && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return true; 
      }
      return false; 
    } catch (error) {
      console.error("Login error in provider:", error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerService(userData);
      if (data && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return true; 
      }
      return false; 
    } catch (error) {
      console.error("Register error in provider:", error);
      return false;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};