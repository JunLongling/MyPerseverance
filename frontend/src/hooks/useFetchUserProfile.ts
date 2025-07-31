// src/hooks/useFetchUserProfile.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/contexts/AuthContext";

interface UserProfile {
  registeredAt: string;
  id: number;
  username: string;
  email: string;
  // add any other fields returned by your backend
}

export default function useFetchUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        logout();
        navigate("/signin");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${apiUrl}/api/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // include cookies if you have refresh tokens as cookies
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
          } catch {
            // ignore JSON parse errors
          }
          setError(msg);
          return;
        }

        const data: UserProfile = await res.json();
        setUser(data);
      } catch (err: any) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [apiUrl, token, logout, navigate]);

  return { user, loading, error };
}
