import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authTokenManager } from "@/utils/authTokenManager";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = authTokenManager.get();
    if (storedToken) setToken(storedToken);
  }, []);

  const login = useCallback((token: string) => {
    authTokenManager.set(token);   // <-- update localStorage
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    authTokenManager.clear();       // <-- clear localStorage
    setToken(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
