import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"
import AppRoutes from "@/AppRoutes"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
