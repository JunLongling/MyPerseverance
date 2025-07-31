import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

interface SignInResponse {
  accessToken: string;
}

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signIn: identifier.trim(), password: password.trim() }),
        credentials: "include", // Important for cookies (refresh token)
      });

      if (!res.ok) {
        console.log("Response status:", res.status);
        let errorMsg = "Sign in failed. Please try again.";

        if (res.status === 401) {
          errorMsg = "Invalid username/email or password.";
        } else if (res.status === 500) {
          errorMsg = "Server error. Please try again later.";
        } else {
          try {
            const errorData = await res.json();
            if (errorData && errorData.message) {
              errorMsg = errorData.message;
            }
          } catch {
            // Ignore JSON parsing errors
          }
        }

        setError(errorMsg);
        return;
      }

      const data: SignInResponse = await res.json();
      login(data.accessToken);
      navigate("/dashboard");
    } catch (err: any) {
      console.log("Fetch error caught:", err);
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md"
      >
        <h2 className="text-center text-2xl font-bold">Sign in to your account</h2>

        {error && (
          <div
            role="alert"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="identifier" className="block mb-2 font-semibold">
            Username or Email
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="Enter your username or email"
            className="w-full rounded border border-gray-300 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded border border-gray-300 px-4 py-3 pr-10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          rounded="fat"
          className="w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
