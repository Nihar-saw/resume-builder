import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../config/firebase";
import { registerUser, loginUser, firebaseLoginUser, setPasswordAPI, logoutUser, getMe } from "../api/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(sessionStorage.getItem("token"));
  const navigate = useNavigate();

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

  /** Handle a successful auth response from the backend (shared by all login methods) */
  const handleAuthSuccess = (data) => {
    if (data.success && data.accessToken) {
      sessionStorage.setItem("token", data.accessToken);
      setTokenState(data.accessToken);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, message: data.message || "Authentication failed" };
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      return handleAuthSuccess(data);
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
      return handleAuthSuccess(data);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Firebase Social Login — shared logic for Google & GitHub
   * 1. Open Firebase popup → get ID token
   * 2. Send ID token to our backend → get JWT
   * 3. Store JWT & set user state
   */
  const firebaseSocialLogin = async (provider) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const data = await firebaseLoginUser(idToken);
      return handleAuthSuccess(data);
    } catch (error) {
      console.error("Firebase social login error:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/popup-closed-by-user") {
        return { success: false, message: "Sign-in cancelled." };
      }
      if (error.code === "auth/account-exists-with-different-credential") {
        return {
          success: false,
          message: "An account already exists with this email using a different sign-in method.",
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || error.message || "Social login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => firebaseSocialLogin(googleProvider);
  const loginWithGitHub = () => firebaseSocialLogin(githubProvider);

  const setPassword = async (password) => {
    setLoading(true);
    try {
      const data = await setPasswordAPI(password);
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || "Failed to set password." };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Set password failed.",
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
      navigate("/");
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
        loginWithGoogle,
        loginWithGitHub,
        setPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
