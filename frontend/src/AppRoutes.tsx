import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

import LandingPage from "@/pages/LandingPage"
import Signup from "@/pages/Signup"
import Login from "@/pages/Login"
import Dashboard from "@/pages/DashBoard"
import ProtectedRoute from "@/components/ProtectedRoute"
import type { JSX } from "react"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfLoggedIn>
            <Signup />
          </RedirectIfLoggedIn>
        }
      />

      {/* Private routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function RedirectIfLoggedIn({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
