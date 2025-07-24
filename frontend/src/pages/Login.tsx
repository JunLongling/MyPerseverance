import React, { useState } from "react"
import axiosClient from "@/api/axiosClient"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in both email and password.")
      return
    }
    setError("")
    try {
      const response = await axiosClient.post("/login", { email, password })
      login(response.data.token)
      navigate("/") 
    } catch (err) {
      setError("Login failed. Check credentials.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md bg-background">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">Login</Button>
      </form>
    </div>
  )
}
