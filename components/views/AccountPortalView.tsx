"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Download,
  LogOut,
  Trash2,
  User as UserIcon,
  AlertTriangle,
  BookOpen,
  Sparkles,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import type { User } from "firebase/auth";
import { formatAuthError } from "@/lib/firebase-error-parser";

export interface DownloadItem {
  productId: string;
  title: string;
  coverUrl?: string;
}

export interface AccountPortalViewProps {
  user: User | null;
  purchases: DownloadItem[];
  isLoading: boolean;
  error: string | null;
  getDownloadUrl: (productId: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  initialTab?: "downloads" | "membership" | "security";
}

export default function AccountPortalView({
  user,
  purchases,
  isLoading,
  error,
  getDownloadUrl,
  signInWithGoogle,
  signOut,
  deleteAccount,
  initialTab = "downloads",
}: AccountPortalViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"downloads" | "membership" | "security">(initialTab);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      setActionError(null);
      await signOut();
      router.push("/");
    } catch (err) {
      setActionError(formatAuthError(err));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setActionError(null);
      await deleteAccount();
      setShowDeleteModal(false);
      router.push("/");
    } catch (err) {
      setActionError(formatAuthError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (productId: string) => {
    try {
      setDownloadingId(productId);
      setActionError(null);
      const url = await getDownloadUrl(productId);
      if (url) {
        window.open(url, "_blank");
      } else {
        setActionError("Download link could not be generated. Please try again.");
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to download item.");
    } finally {
      setDownloadingId(null);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     STATE 1: UNAUTHENTICATED (MEMBER LOGIN & BENEFIT SHOWCASE)
  ─────────────────────────────────────────────────────────────── */
  if (!user && !isLoading) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <Badge variant="gold" className="gap-1.5">
              <Sparkles size={14} className="text-[#c5a059]" />
              Member Access & Portal
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#1a1d20] tracking-tight">
              Welcome to Grace Path Media
            </h1>
            <p className="text-base text-[var(--color-text-secondary)] font-normal leading-relaxed">
              Sign in to your account to instantly access your purchased digital ebooks, download your files, and manage your Daily Walk membership.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Card: Member Benefits Showcase */}
            <div className="lg:col-span-7">
              <GlassCard className="p-8 sm:p-10 h-full flex flex-col justify-between border border-[#c5a059]/35 bg-gradient-to-b from-[#FFFDF8] via-[#FAF5E8] to-[#F5EFE0] shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-[#1a1d20]">
                        Your Digital Faith Library
                      </h2>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        All your readings & reflections in one quiet place
                      </p>
                    </div>
                  </div>

                  <hr className="border-[#c5a059]/25" />

                  <ul className="space-y-4">
                    {[
                      {
                        title: "Instant PDF Downloads",
                        desc: "Access your purchased ebooks anytime from any device.",
                      },
                      {
                        title: "Daily Walk With God Archives",
                        desc: "Full audio & text archives for active devotional subscribers.",
                      },
                      {
                        title: "Lifetime Purchase Rights",
                        desc: "Your digital downloads remain safely saved in your account.",
                      },
                    ].map((benefit) => (
                      <li key={benefit.title} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-[#c5a059] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-[#1a1d20]">{benefit.title}</h4>
                          <p className="text-xs text-[var(--color-text-secondary)] font-normal">
                            {benefit.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 border-t border-[#c5a059]/20 mt-6 flex items-center gap-2 text-xs font-semibold text-[#997a2e]">
                  <ShieldCheck size={16} />
                  <span>Encrypted & Secure OAuth Authentication</span>
                </div>
              </GlassCard>
            </div>

            {/* Right Card: Google Sign In Form */}
            <div className="lg:col-span-5">
              <GlassCard className="p-8 sm:p-10 h-full flex flex-col justify-between border border-[#c5a059]/35 bg-white shadow-xl">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] mb-2">
                      <Lock size={22} />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-[#1a1d20]">
                      Sign In to Account
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Use your Google account to log in safely with one click.
                    </p>
                  </div>

                  {error && (
                    <div className="text-xs text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 font-medium leading-relaxed">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    disabled={isLoading}
                    id="account-google-login-btn"
                    className="w-full flex items-center justify-center gap-3 bg-[#fafaf7] hover:bg-[#c5a059]/15 text-[#1a1d20] font-semibold rounded-full px-5 py-3.5 text-sm transition-all border border-[#c5a059]/50 hover:border-[#c5a059] shadow-sm disabled:opacity-50 group cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-[#c5a059] rounded-full animate-spin" />
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
                    <span>{isLoading ? "Authenticating..." : "Continue with Google"}</span>
                  </button>
                </div>

                <div className="pt-6 text-center border-t border-black/5">
                  <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                    Need help? Contact support at support@gracepathmedia.com
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     STATE 2: AUTHENTICATED (UNIFIED ACCOUNT & DOWNLOADS PORTAL)
  ─────────────────────────────────────────────────────────────── */
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-8">
        {/* Profile Banner */}
        <GlassCard className="p-8 border border-[#c5a059]/35 bg-gradient-to-r from-[#FFFDF8] via-[#FAF5E8] to-[#F5EFE0] shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#c5a059] text-white flex items-center justify-center font-heading text-2xl font-bold shadow-md shrink-0 border-2 border-white">
                {user?.email?.charAt(0).toUpperCase() || user?.displayName?.charAt(0).toUpperCase() || "G"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1d20]">
                    {user?.displayName || "Grace Path Member"}
                  </h1>
                  <Badge variant="gold" className="text-[11px]">
                    Verified Member
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] font-medium">
                  <UserIcon size={14} className="text-[#c5a059]" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={handleSignOut}
                variant="gold-outline"
                size="sm"
                className="gap-2"
                id="portal-signout-btn"
              >
                <LogOut size={15} />
                Sign Out
              </Button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                id="portal-delete-account-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shadow-xs"
              >
                <Trash2 size={13} />
                Delete Account
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Global Error Banner */}
        {(actionError || error) && (
          <div className="text-xs text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 font-medium leading-relaxed flex items-center justify-between">
            <span>{actionError || error}</span>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-red-500 hover:text-red-700 font-bold text-sm ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-[#c5a059]/30 shadow-sm max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab("downloads")}
            id="tab-downloads"
            className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "downloads"
                ? "bg-[#c5a059] text-white shadow-md"
                : "text-[var(--color-text-secondary)] hover:text-[#1a1d20] hover:bg-[#c5a059]/10"
            }`}
          >
            <Download size={15} />
            <span>Digital Downloads ({purchases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("membership")}
            id="tab-membership"
            className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "membership"
                ? "bg-[#c5a059] text-white shadow-md"
                : "text-[var(--color-text-secondary)] hover:text-[#1a1d20] hover:bg-[#c5a059]/10"
            }`}
          >
            <Sparkles size={15} />
            <span>Membership</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            id="tab-security"
            className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "security"
                ? "bg-[#c5a059] text-white shadow-md"
                : "text-[var(--color-text-secondary)] hover:text-[#1a1d20] hover:bg-[#c5a059]/10"
            }`}
          >
            <KeyRound size={15} />
            <span>Account Details</span>
          </button>
        </div>

        {/* ─── TAB 1: DIGITAL DOWNLOADS ─── */}
        {activeTab === "downloads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#1a1d20]">
                  My Ebooks & Downloads
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Download your purchased PDF books instantly below.
                </p>
              </div>
              <Button href="/ebooks" variant="gold-outline" size="sm">
                Browse Ebooks
              </Button>
            </div>

            {isLoading && <LoadingSpinner className="py-16" />}

            {!isLoading && purchases.length === 0 && (
              <GlassCard className="p-12 text-center border border-[#c5a059]/30 bg-white space-y-4">
                <div className="h-16 w-16 rounded-full bg-[#FAF5E8] border border-[#c5a059]/30 flex items-center justify-center mx-auto text-[#c5a059]">
                  <Download size={28} />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="font-heading text-xl font-bold text-[#1a1d20]">
                    No Downloads Available Yet
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    You haven&apos;t purchased any digital ebooks yet. Once purchased, your PDF download links will permanently appear here.
                  </p>
                </div>
                <div className="pt-2">
                  <Button href="/ebooks" variant="gold" size="md">
                    Explore Ebook Catalog
                  </Button>
                </div>
              </GlassCard>
            )}

            <div className="space-y-4">
              {purchases.map((item) => (
                <GlassCard
                  key={item.productId}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#c5a059]/30 bg-white hover-gold-glow shadow-md"
                >
                  <div className="flex items-center gap-4">
                    {/* Cover Thumbnail */}
                    <div className="h-16 w-12 rounded-xl bg-gradient-to-br from-[#FAF5E8] to-[#F5EFE0] border border-[#c5a059]/40 flex items-center justify-center shrink-0 shadow-xs">
                      <span className="font-heading text-xl font-bold text-[#c5a059]">
                        {item.title.charAt(0)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="gold" className="text-[10px]">
                          Instant PDF
                        </Badge>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-[#1a1d20]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Purchased • Ready for immediate download
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDownload(item.productId)}
                    variant="gold"
                    size="sm"
                    disabled={downloadingId === item.productId}
                    className="shrink-0"
                  >
                    {downloadingId === item.productId ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <>
                        <Download size={15} />
                        Download PDF
                      </>
                    )}
                  </Button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 2: DAILY WALK MEMBERSHIP ─── */}
        {activeTab === "membership" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#1a1d20]">
                  Daily Walk With God Program
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Your daily devotional subscription status and audio archive access.
                </p>
              </div>
              <Button href="/membership" variant="gold" size="sm">
                View Membership Plans
              </Button>
            </div>

            <GlassCard className="p-8 border border-[#c5a059]/30 bg-white space-y-6 shadow-md">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                  <Badge variant="gold" className="gap-1">
                    <Sparkles size={12} />
                    Account Membership Status
                  </Badge>
                  <h3 className="font-heading text-2xl font-bold text-[#1a1d20]">
                    Free Member Account
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                    You currently hold a standard Grace Path account. Subscribe to the &quot;Daily Walk With God&quot; program to receive morning email readings and full audio archive access.
                  </p>
                </div>

                <Button href="/membership" variant="gold" size="md" className="shrink-0">
                  <span>Upgrade to Devotional Access</span>
                  <ArrowRight size={16} />
                </Button>
              </div>

              <hr className="border-black/5" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/25 space-y-1">
                  <p className="text-xs font-semibold text-[#997a2e]">Daily Reflections</p>
                  <p className="text-sm font-bold text-[#1a1d20]">In Your Inbox</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/25 space-y-1">
                  <p className="text-xs font-semibold text-[#997a2e]">Audio Experience</p>
                  <p className="text-sm font-bold text-[#1a1d20]">Full Library Access</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/25 space-y-1">
                  <p className="text-xs font-semibold text-[#997a2e]">Billing</p>
                  <p className="text-sm font-bold text-[#1a1d20]">Cancel Anytime via PayPal</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ─── TAB 3: ACCOUNT DETAILS & SECURITY ─── */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-[#1a1d20]">
                Account & Security Settings
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Manage your credentials and preferences.
              </p>
            </div>

            <GlassCard className="p-8 border border-[#c5a059]/30 bg-white space-y-6 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="text-base font-semibold text-[#1a1d20]">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Sign-In Provider
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge variant="gold">Google OAuth</Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Account Status
                  </label>
                  <p className="text-sm font-medium text-emerald-700">Active & Verified</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    User ID (UID)
                  </label>
                  <p className="text-xs font-mono text-[var(--color-text-secondary)] truncate">
                    {user?.uid}
                  </p>
                </div>
              </div>

              <hr className="border-black/5" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-red-700">Danger Zone</h4>
                  <p className="text-xs text-[var(--color-text-secondary)] font-normal">
                    Permanently delete your Grace Path account and remove all saved preferences.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shadow-xs shrink-0"
                >
                  Delete Account...
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ─── Delete Account Light Theme Confirmation Modal ─── */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <GlassCard className="max-w-md w-full p-8 space-y-6 border border-red-300 bg-white shadow-2xl">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-3 rounded-full bg-red-100 border border-red-200">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-[#1a1d20]">Delete Account?</h3>
                  <p className="text-xs text-red-600 font-medium">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Are you sure you want to permanently delete your account? You will lose access to your saved profile and downloads library.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="gold-outline"
                  size="sm"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 shadow-md cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Account"}
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
