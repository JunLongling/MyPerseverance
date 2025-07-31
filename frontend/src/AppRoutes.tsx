import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import LandingPage from "@/pages/LandingPage";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/DashBoard";
import Navbar from "@/components/Navbar";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing page with Navbar */}
      <Route element={<LandingWithNavbarLayout />}>
        <Route element={<RedirectIfSignedInLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
      </Route>

      {/* Auth routes without Navbar */}
      <Route element={<RedirectIfSignedInLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Protected routes with auth guard */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Catch-all redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Layout with Navbar for landing page only
function LandingWithNavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Layout that redirects signed-in users away from public/auth pages to dashboard
function RedirectIfSignedInLayout() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

// Layout that protects all nested routes
function ProtectedLayout() {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
}
