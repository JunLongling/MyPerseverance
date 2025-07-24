import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
  useAuth()


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      </header>

      <main className="flex-grow">
        {/* Your dashboard content here */}
        <p>This is your private dashboard. Track your progress here.</p>
      </main>
    </div>
  )
}
