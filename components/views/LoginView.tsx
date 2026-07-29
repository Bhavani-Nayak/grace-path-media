"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginView() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="text-center mb-8 space-y-3">
          <Badge variant="gold">Welcome to Grace Path</Badge>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20] tracking-tight">
            {mode === "signin" ? "Sign In to Your Account" : "Create Your Account"}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] font-normal leading-relaxed">
            {mode === "signin"
              ? "Access your personal readings, digital library, and support history."
              : "Join our spiritual community to access eBooks and study materials."}
          </p>
        </div>

        <GlassCard className="p-8 space-y-6 border border-[#c5a059]/35 bg-white shadow-xl">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-full bg-[#fafaf7] p-1 border border-[#c5a059]/30">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setIsSuccess(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                mode === "signin"
                  ? "bg-[#c5a059] text-white shadow-xs"
                  : "text-[var(--color-text-secondary)] hover:text-[#1a1d20]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setIsSuccess(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                mode === "signup"
                  ? "bg-[#c5a059] text-white shadow-xs"
                  : "text-[var(--color-text-secondary)] hover:text-[#1a1d20]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center mx-auto text-[#c5a059]">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1a1d20]">
                {mode === "signin" ? "Signed In Successfully!" : "Account Created!"}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Welcome back to Grace Path Media. You can now explore all eBooks and content.
              </p>
              <Button href="/ebooks" variant="gold" className="w-full">
                Browse eBooks Catalog
              </Button>
            </div>
          ) : (
            <>
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#fafaf7] hover:bg-[#c5a059]/10 text-[#1a1d20] font-semibold rounded-full px-5 py-3.5 text-xs sm:text-sm transition-all border border-[#c5a059]/40 hover:border-[#c5a059] shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-[#c5a059] rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-black/10 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider shrink-0">
                  Or continue with email
                </span>
                <div className="border-t border-black/10 w-full" />
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-[#1a1d20]">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-[#c5a059]" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c5a059]/30 bg-[#fafaf7] text-xs font-medium text-[#1a1d20] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#1a1d20]">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-[#c5a059]" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c5a059]/30 bg-[#fafaf7] text-xs font-medium text-[#1a1d20] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#1a1d20]">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-[#c5a059]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c5a059]/30 bg-[#fafaf7] text-xs font-medium text-[#1a1d20] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="gold"
                  size="md"
                  className="w-full justify-center gap-2 py-3 font-bold text-xs sm:text-sm shadow-md"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          <p className="text-center text-[11px] text-[var(--color-text-muted)] leading-relaxed font-normal pt-2 border-t border-black/5">
            By continuing, you agree to Grace Path Media&apos;s{" "}
            <a href="/terms" className="underline hover:text-[#1a1d20]">
              Terms of Service
            </a>{" "}
            &{" "}
            <a href="/privacy" className="underline hover:text-[#1a1d20]">
              Privacy Policy
            </a>
            .
          </p>
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
