import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow py-20 text-center px-4">
        <h2 className="text-4xl font-bold mb-4">Stay consistent with MyPerseverance</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Keep moving forward, one step at a time. MyPerseverance helps you track habits and tasks so you never lose sight of your progress.
        </p>
        <Button size="lg" onClick={() => navigate("/signup")}>Get Started</Button>
      </main>

      <footer className="mt-auto py-10 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Persevere. Keep walking forward.
      </footer>
    </div>
  )
}
