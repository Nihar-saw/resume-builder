import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Guards
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ResumeBuilder from "../pages/ResumeBuilder";
import Templates from "../pages/Templates";
import ATSChecker from "../pages/ATSChecker";
import AIAssistant from "../pages/AIAssistant";
import ResumePreview from "../pages/ResumePreview";
import Portfolio from "../pages/Portfolio";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import PublicResume from "../pages/PublicResume";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Public Resume Share View */}
      <Route path="/r/:slug" element={<PublicResume />} />

      {/* Auth Pages (Restricted to non-logged-in users) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Private Dashboard Pages */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resumes" element={<Dashboard />} /> {/* Fallback to dashboard or general list */}
          <Route path="/ats" element={<ATSChecker />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Full-width Builder Pages (Not using dashboard layout due to complex UI requirements) */}
        <Route path="/builder/:id" element={<ResumeBuilder />} />
        <Route path="/preview/:id" element={<ResumePreview />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
