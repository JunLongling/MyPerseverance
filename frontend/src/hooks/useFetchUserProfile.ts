import { useAuth } from "@/contexts/AuthContext";

export default function useFetchUserProfile() {
  const { user, loading, error, refetchUser } = useAuth();
  return { user, loading, error, refetch: refetchUser };
}
