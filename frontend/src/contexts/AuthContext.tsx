import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authTokenManager } from "@/utils/authTokenManager";

export interface UserProfile {
  registeredAt: string;
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  error: string;
  login: (token: string) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => authTokenManager.get());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError("");
    authTokenManager.clear();
  }, []);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) logout();
        else {
          const errorData = await res.json().catch(() => null);
          setError(errorData?.message || "Failed to fetch user.");
        }
        setUser(null);
        return;
      }

      const data: UserProfile = await res.json();
      setUser((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data)); // prevent ref rerender
    } catch (err) {
      setError("Network error.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl, logout]);

  useEffect(() => {
    if (token) fetchUser();
    else {
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    authTokenManager.set(newToken);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
