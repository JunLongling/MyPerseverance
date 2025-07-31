import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // <-- useAuth is named export now
import { useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 10);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-purple-700">
          MyPerseverance
        </span>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-gray-600 hover:text-red-500 transition" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
