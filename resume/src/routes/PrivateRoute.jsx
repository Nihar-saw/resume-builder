import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

const PrivateRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Force password setup for Google/GitHub signups
  if (user && !user.isPasswordSet) {
    if (location.pathname !== "/set-password") {
      return <Navigate to="/set-password" replace />;
    }
  } else {
    // If password is set, do not allow visiting the set-password page
    if (location.pathname === "/set-password") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
