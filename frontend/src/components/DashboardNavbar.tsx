import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";
import useAuth from "@/contexts/AuthContext";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / App Title */}
        <Link to="/" className="text-xl font-bold text-purple-700 hover:text-purple-900 transition">
          Persevere
        </Link>

        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <Link to="/dashboard" className="text-gray-700 hover:text-purple-700 font-medium transition">
            Dashboard
          </Link>
          <Link to="/journal" className="text-gray-700 hover:text-purple-700 font-medium transition">
            Journal
          </Link>

          {/* User Info and Logout */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-semibold">
              {user?.username}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-5 w-5 text-gray-600 hover:text-red-500 transition" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
