import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="group relative transition-colors cursor-pointer"
    >
      <Sun
        className="pointer-events-none h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ease-in-out group-hover:scale-110 dark:scale-0 dark:-rotate-90"
      />
      <Moon
        className="pointer-events-none absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all duration-300 ease-in-out group-hover:scale-110 dark:scale-100 dark:rotate-0"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

