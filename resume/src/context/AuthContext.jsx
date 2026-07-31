import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { registerUser, loginUser, logoutUser, getMe } from "../api/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const data = await getMe();
          if (data.success) {
            setUser(data.user);
          } else {
            handleLogoutState();
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          handleLogoutState();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const handleLogoutState = () => {
    sessionStorage.removeItem("token");
    setTokenState(null);
    setUser(null);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      if (data.success && data.accessToken) {
        sessionStorage.setItem("token", data.accessToken);
        setTokenState(data.accessToken);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await registerUser(userData);
      if (data.success && data.accessToken) {
        sessionStorage.setItem("token", data.accessToken);
        setTokenState(data.accessToken);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      handleLogoutState();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
