import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import Animation from "@/components/ui/Animation";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* Hero section: animation + heading + text + button */}
      <section className="flex flex-col items-center justify-center px-6 py-16 text-center max-w-3xl mx-auto">
        <Animation />
        <h1 className="text-4xl font-bold mt-8 mb-4">
          Stay consistent with MyPerseverance
        </h1>
        <p className="text-muted-foreground max-w-xl mb-8">
          Keep moving forward, one step at a time. MyPerseverance helps you track habits and tasks so you never lose sight of your progress.
        </p>
        <Button
          onClick={() => navigate("/signup")}
          variant="primary"
          size="md"
          shadow
          rounded="full"
          animated
        >
          Get Started
        </Button>
      </section>

      {/* Push footer to bottom */}
      <footer className="mt-auto py-10 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Persevere. Keep walking forward.
      </footer>
    </div>
  );
}
