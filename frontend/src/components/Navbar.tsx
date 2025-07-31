import { useNavigate } from "react-router-dom";
import useAuth from "@/contexts/AuthContext";
import { NavbarSignedIn } from "@/components/ui/NavbarSignedIn";
import { NavbarSignedOut } from "@/components/ui/NavbarSignedOut";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  return token ? (
    <NavbarSignedIn onSignOut={handleSignOut} />
  ) : (
    <NavbarSignedOut />
  );
}
