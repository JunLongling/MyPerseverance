import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  registeredAt: string;
  id: number;
  username: string;
  email: string;
}

let cachedUser: UserProfile | null = null;

export default function useFetchUserProfile({ useCache = true } = {}) {
  const { token } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(useCache ? cachedUser : null);
  const [loading, setLoading] = useState(!cachedUser && !!token);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      setError("");
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
          // Unauthorized: clear user and show error but DO NOT logout or navigate here
          setUser(null);
          setError("Unauthorized. Please log in again.");
          setLoading(false);
          return;
        }

        let msg = `Failed to fetch user data: ${res.status} ${res.statusText}`;
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {
          // ignore JSON parsing error
        }
        setError(msg);
        setLoading(false);
        return;
      }

      const data: UserProfile = await res.json();
      cachedUser = data;
      setUser(data);
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
      setError("");
    }
  }, [token, fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}
