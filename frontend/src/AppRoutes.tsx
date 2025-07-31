import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import useAuth from "@/contexts/AuthContext";

import LandingPage from "@/pages/LandingPage";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/DashBoard";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import type { JSX } from "react";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes with Navbar */}
      <Route element={<LandingWithNavbarLayout />}>
        <Route
          path="/"
          element={
            <RedirectIfSignedIn>
              <LandingPage />
            </RedirectIfSignedIn>
          }
        />
      </Route>

      {/* Auth routes without Navbar */}
      <Route element={<AuthLayout />}>
        <Route
          path="/signin"
          element={
            <RedirectIfSignedIn>
              <SignIn />
            </RedirectIfSignedIn>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfSignedIn>
              <SignUp />
            </RedirectIfSignedIn>
          }
        />
      </Route>

      {/* Protected routes without Navbar */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Layout with Navbar for landing page and similar public pages
function LandingWithNavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Layout for auth pages (signin/signup) without Navbar
function AuthLayout() {
  return <Outlet />;
}

// Layout for protected pages (no Navbar as requested)
function ProtectedLayout() {
  return <Outlet />;
}

// Redirects signed-in users away from public/auth pages to dashboard
function RedirectIfSignedIn({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
