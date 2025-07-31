import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useDebounceValue } from "usehooks-ts";
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";
import isEmail from "validator/lib/isEmail";

export default function SignUp() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Touched flags for showing errors on blur
  const [emailTouched, setEmailTouched] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // API and UI state
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Debounced inputs to reduce API calls
  const [debouncedEmail] = useDebounceValue(email, 500);
  const [debouncedUsername] = useDebounceValue(username, 500);

  // Validation functions
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
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/.test(value)
    )
      return "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.";
    return "";
  };

  // Check email availability on debounced email change
  useEffect(() => {
    const error = validateEmail(debouncedEmail);
    setEmailError(error);
    if (error || !debouncedEmail) {
      setEmailAvailable(false);
      return;
    }

    axiosClient
      .get(`/check-email?email=${debouncedEmail}`)
      .then((res) => setEmailAvailable(res.data.available))
      .catch(() => setEmailAvailable(false));
  }, [debouncedEmail]);

  // Check username availability on debounced username change
  useEffect(() => {
    const error = validateUsername(debouncedUsername);
    setUsernameError(error);
    if (error || !debouncedUsername) {
      setUsernameAvailable(false);
      return;
    }

    axiosClient
      .get(`/check-username?username=${debouncedUsername}`)
      .then((res) => setUsernameAvailable(res.data.available))
      .catch(() => setUsernameAvailable(false));
  }, [debouncedUsername]);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const usernameErr = validateUsername(username);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setUsernameError(usernameErr);
    setPasswordError(passwordErr);

    setEmailTouched(true);
    setUsernameTouched(true);
    setPasswordTouched(true);

    if (emailErr || usernameErr || passwordErr || !emailAvailable || !usernameAvailable) return;

    try {
      setIsSubmitting(true);
      await axiosClient.post("/signup", { email, username, password });
      navigate("/signin"); // Redirect to sign-in page after successful signup
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md"
      >
        <h2 className="text-center text-2xl font-bold">Create an Account</h2>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
              setApiError("");
            }}
            onBlur={() => setEmailTouched(true)}
            className={`w-full rounded border px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:ring-2 ${
              emailTouched && emailError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-600"
            }`}
            placeholder="Email"
            aria-invalid={emailTouched && !!emailError}
          />
          <p className="mt-1 text-xs text-gray-500">
            We'll never share your email with anyone else.
          </p>
          {emailTouched && emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
          {email && !emailError && (
            <div className="mt-1 flex items-center gap-2 text-sm">
              {emailAvailable ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>
                {emailAvailable ? "Email is available" : "Email is taken"}
              </span>
            </div>
          )}
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block mb-2 font-semibold">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(validateUsername(e.target.value));
              setApiError("");
            }}
            onBlur={() => setUsernameTouched(true)}
            className={`w-full rounded border px-4 py-3 placeholder:text-gray-300 focus:outline-none focus:ring-2 ${
              usernameTouched && usernameError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-600"
            }`}
            placeholder="Username"
            aria-invalid={usernameTouched && !!usernameError}
          />
          <p className="mt-1 text-xs text-gray-500">
            Must start with a letter and include only letters, numbers, or underscores (3–20 characters).
          </p>
          {usernameTouched && usernameError && (
            <p className="mt-1 text-sm text-red-600">{usernameError}</p>
          )}
          {username && !usernameError && (
            <div className="mt-1 flex items-center gap-2 text-sm">
              {usernameAvailable ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>
                {usernameAvailable ? "Username is available" : "Username is taken"}
              </span>
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-2 font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
                setApiError("");
              }}
              onBlur={() => setPasswordTouched(true)}
              className={`w-full rounded border px-4 py-3 pr-10 placeholder:text-gray-300 focus:outline-none focus:ring-2 ${
                passwordTouched && passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-600"
              }`}
              placeholder="Password"
              aria-invalid={passwordTouched && !!passwordError}
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
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
          </p>
          {passwordTouched && passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}
        </div>

        {/* API Error */}
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}

        {/* Submit button */}
        <Button type="submit" rounded="fat" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up"}
        </Button>

        {/* Sign in link */}
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
