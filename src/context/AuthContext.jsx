import { createContext, useState, useEffect, useContext } from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../services/authService";

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [actionLoading, setActionLoading] = useState(false); 

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    setActionLoading(true);
    try {
      const data = await loginService(userData);
      if (data && data.accessToken && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.accessToken);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Login failed:", error);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const register = async (userData) => {
    setActionLoading(true);
    try {
      const data = await registerService(userData);
      if (data && data.accessToken && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.accessToken);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Register failed:", error);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    setActionLoading(true);
    try {
      await logoutService();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("❌ Logout failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        actionLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
