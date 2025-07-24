import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/") // Go to landing page after logout
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      {/* Only show site title if NOT logged in */}
      {!token && (
        <h1 className="text-xl font-bold text-primary">
          <Link to="/">MyPerseverance</Link>
        </h1>
      )}

      <div className="flex items-center gap-4">
        <ModeToggle />
        {token ? (
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
