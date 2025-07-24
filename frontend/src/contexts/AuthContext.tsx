// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react"

interface AuthContextType {
  token: string | null
  login: (token: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"))

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  const logout = (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem("token")
      setToken(null)
      resolve()
    })
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
