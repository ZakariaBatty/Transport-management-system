"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

import {
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const demoAccounts = [
  { email: "superadmin@test.com", role: "Super Admin" },
  { email: "admin@test.com", role: "Admin" },
  { email: "manager@test.com", role: "Manager" },
  { email: "driver@test.com", role: "Driver" },
];

export function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@transithub.com");
  const [password, setPassword] = useState("Passwor@d123");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Email validation
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError && validateEmail(value)) {
      setEmailError("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailError("");
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!password || password.trim().length === 0) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      // Call NextAuth signIn with credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error || "Invalid email or password. Please try again.",
        );
        setLoading(false);
      } else if (result?.ok) {
        setSuccess("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", err);
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding */}
      <div className="hidden flex-col justify-between bg-primary p-12 md:flex md:w-[45%]">
        <div>
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Truck className="size-6 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            TransitHub
          </h1>
          <p className="mt-3 text-base leading-relaxed text-primary-foreground/70">
            Modern Transportation Management Platform for professional fleet
            operations.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/50">
            Demo Accounts
          </p>
          <div className="space-y-2">
            {demoAccounts.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => {
                  setEmail(a.email);
                  setPassword("Passwor@d123");
                }}
                className="flex w-full items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-left transition-colors hover:bg-white/20"
              >
                <span className="font-mono text-xs text-white/85">
                  {a.email}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white/80 text-[10px]"
                >
                  {a.role}
                </Badge>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/50">
            Password:{" "}
            <span className="font-mono text-white/80">password123</span>
          </p>
          <p className="mt-6 text-xs text-white/30">
            © 2026 TransitHub. Demo application.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 md:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your TransitHub account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="name@example.com"
                  className={`pl-10 ${emailError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  required
                  disabled={loading}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
              </div>
              {emailError && (
                <p
                  id="email-error"
                  className="text-xs text-destructive font-medium"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={loading}
                  aria-describedby={error ? "password-error" : undefined}
                />
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="size-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {loading ? "Signing in…" : "Login"}
            </Button>
          </form>

          {/* Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <p className="text-xs text-blue-700">
                <span className="font-bold">Demo Mode:</span> Click any account
                on the left panel, then sign in with{" "}
                <span className="font-mono">password123</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
