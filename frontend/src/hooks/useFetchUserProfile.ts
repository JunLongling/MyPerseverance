import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/contexts/AuthContext";

interface UserProfile {
  registeredAt: string;
  id: number;
  username: string;
  email: string;
  // Add other fields as needed
}

let cachedUser: UserProfile | null = null; // basic memory cache

export default function useFetchUserProfile({ useCache = true } = {}) {
  const [user, setUser] = useState<UserProfile | null>(useCache ? cachedUser : null);
  const [loading, setLoading] = useState(!cachedUser);
  const [error, setError] = useState("");
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchUser = useCallback(async () => {
    if (!token) {
      logout();
      navigate("/signin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiUrl}/users/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          logout();
          navigate("/signin");
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
  }, [apiUrl, token, logout, navigate]);

  useEffect(() => {
    if (!user && token) {
      fetchUser();
    }
  }, [fetchUser, token, user]);

  return { user, loading, error, refetch: fetchUser };
}
