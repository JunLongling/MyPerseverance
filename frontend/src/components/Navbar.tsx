import { Link } from "react-router-dom";
import useFetchUserProfile from "@/hooks/useFetchUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { buttonBaseStyles, variants, sizes } from "@/components/ui/Button";

export default function Navbar() {
  const { token } = useAuth();
  const { user } = useFetchUserProfile();

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 bg-base-100 text-base-content gap-2">
      <h1 className="text-xl font-bold text-primary">
        MyPerseverance
      </h1>

      <div className="flex items-center gap-4">
        {token ? (
          <span className="hidden sm:inline text-sm text-gray-600 font-medium">
            {user?.username}
          </span>
        ) : (
          <>
            <Link
              to="/signin"
              className={`${buttonBaseStyles} ${variants.ghost} ${sizes.md} rounded-md inline-flex items-center justify-center`}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className={`${buttonBaseStyles} ${variants.outline} ${sizes.md} rounded-full inline-flex items-center justify-center`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
