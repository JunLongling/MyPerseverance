import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/wdwdwd";
import { useDebounceValue } from "usehooks-ts";
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";
import isEmail from "validator/lib/isEmail";
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const [emailTouched, setEmailTouched] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [debouncedEmail] = useDebounceValue(email, 500);
  const [debouncedUsername] = useDebounceValue(username, 500);

  const validateEmail = (value: string) => {
    if (!value) return "Email is required.";
    if (!isEmail(value)) return "Invalid email format.";
    return "";
  };

  const validateUsername = (value: string) => {
    if (!value) return "Username is required.";
    if (!/^[A-Za-z][A-Za-z0-9_]{2,19}$/.test(value))
      return "Username must start with a letter and contain only letters, numbers, or underscores (3–20 characters).";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/.test(value))
      return "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.";
    return "";
  };

  useEffect(() => {
    if (!debouncedEmail) {
      setEmailAvailable(null);
      setEmailError("");
      return;
    }

    const controller = new AbortController();

    const check = async () => {
      const error = validateEmail(debouncedEmail);
      console.log("Email validation:", error || "Valid");
      setEmailError(error);
      if (error) {
        setEmailAvailable(null);
        return;
      }

      try {
        const res = await axiosClient.get(`/auth/check-email?email=${encodeURIComponent(debouncedEmail)}`, {
          signal: controller.signal,
        });
        console.log("Email availability response:", res.data);
        setEmailAvailable(res.data.available);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Email check error:", err);
          setEmailAvailable(null);
        }
      }
    };

    check();
    return () => controller.abort();
  }, [debouncedEmail]);

  useEffect(() => {
    if (!debouncedUsername) {
      setUsernameAvailable(null);
      setUsernameError("");
      return;
    }

    const controller = new AbortController();

    const check = async () => {
      const error = validateUsername(debouncedUsername);
      console.log("Username validation:", error || "Valid");
      setUsernameError(error);
      if (error) {
        setUsernameAvailable(null);
        return;
      }

      try {
        const res = await axiosClient.get(`/auth/check-username?username=${encodeURIComponent(debouncedUsername)}`, {
          signal: controller.signal,
        });
        console.log("Username availability response:", res.data);
        setUsernameAvailable(res.data.available);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Username check error:", err);
          setUsernameAvailable(null);
        }
      }
    };

    check();
    return () => controller.abort();
  }, [debouncedUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const usernameErr = validateUsername(username);
    const passwordErr = validatePassword(password);

    console.log("Submitting with:");
    console.log("Email:", email, "->", emailErr || "Valid");
    console.log("Username:", username, "->", usernameErr || "Valid");
    console.log("Password:", password, "->", passwordErr || "Valid");

    setEmailError(emailErr);
    setUsernameError(usernameErr);
    setPasswordError(passwordErr);

    setEmailTouched(true);
    setUsernameTouched(true);
    setPasswordTouched(true);

    if (emailErr || usernameErr || passwordErr || !emailAvailable || !usernameAvailable) {
      console.log("Form has errors. Submission aborted.");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Sending signup request to /auth/signup...");
      const response = await axiosClient.post("/auth/signup", { email, username, password });
      console.log("Signup success:", response.data);
      navigate("/signin");
    } catch (err: any) {
      console.error("Signup failed:", err.response?.data || err.message);
      setApiError(err.response?.data || "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold">Create an Account</h2>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setApiError("");
              setEmailAvailable(null);
            }}
            onBlur={() => setEmailTouched(true)}
            className={`w-full rounded border px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:ring-2 ${
              emailTouched && emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-600"
            }`}
            placeholder="Email"
          />
          {emailTouched && emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          {email && !emailError && emailAvailable !== null && (
            <div className="mt-1 flex items-center gap-2 text-sm">
              {emailAvailable ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span>{emailAvailable ? "Email is available" : "Email is taken"}</span>
            </div>
          )}
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block mb-2 font-semibold">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError("");
              setApiError("");
              setUsernameAvailable(null);
            }}
            onBlur={() => setUsernameTouched(true)}
            className={`w-full rounded border px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:ring-2 ${
              usernameTouched && usernameError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-600"
            }`}
            placeholder="Username"
          />
          {usernameTouched && usernameError && <p className="mt-1 text-sm text-red-600">{usernameError}</p>}
          {username && !usernameError && usernameAvailable !== null && (
            <div className="mt-1 flex items-center gap-2 text-sm">
              {usernameAvailable ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span>{usernameAvailable ? "Username is available" : "Username is taken"}</span>
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-2 font-semibold">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                setApiError("");
              }}
              onBlur={() => setPasswordTouched(true)}
              className={`w-full rounded border px-4 py-3 pr-10 placeholder:text-gray-300 focus:outline-none focus:ring-2 ${
                passwordTouched && passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-600"
              }`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {passwordTouched && passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
        </div>

        {apiError && <p className="text-sm text-red-600">{apiError}</p>}

        <Button type="submit" rounded="fat" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up"}
        </Button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
