import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import LandingPage from "@/pages/LandingPage";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/DashBoard";
import Navbar from "@/components/Navbar";
import { Spinner } from "@/components/ui/Spinner";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing with Navbar */}
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

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function LandingWithNavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function RedirectIfSignedInLayout() {
  const { token, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function ProtectedLayout() {
  const { token, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
