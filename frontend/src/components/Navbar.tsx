import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchUserProfile from "@/hooks/useFetchUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { buttonBaseStyles, variants, sizes } from "@/components/ui/Button";

export default function Navbar() {
  const { token } = useAuth();
  const { user } = useFetchUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(open => !open);

  return (
    <header className="sticky top-0 z-50 bg-base-100 text-base-content">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-primary">
          MyPerseverance
        </h1>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
          {token ? (
            <span className="text-sm text-gray-600 font-medium">
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

        {/* Mobile hamburger button */}
        <button
          type="button"
          className="sm:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Toggle menu"
          onClick={toggleMobileMenu}
        >
          {/* Hamburger icon */}
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              // X icon when open
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              // Hamburger lines when closed
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="sm:hidden px-6 pb-4 border-t border-gray-200">
          {token ? (
            <p className="text-gray-700 text-base font-medium py-2">{user?.username}</p>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/signin"
                className={`${buttonBaseStyles} ${variants.ghost} ${sizes.md} rounded-md inline-flex items-center justify-center w-full text-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className={`${buttonBaseStyles} ${variants.outline} ${sizes.md} rounded-full inline-flex items-center justify-center w-full text-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
