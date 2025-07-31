import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface UserProfile {
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

let cachedUser: UserProfile | null = null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(cachedUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Initialize token from localStorage once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
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
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) {
          setUser(null);
          setError("Unauthorized. Please log in again.");
          logout();  // auto-logout if unauthorized
          return;
        }
        let msg = `Failed to fetch user data: ${res.status} ${res.statusText}`;
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        setError(msg);
        return;
      }
      const data: UserProfile = await res.json();
      cachedUser = data;
      setUser(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  // Whenever token changes, refetch user
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    cachedUser = null;
    setError("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
