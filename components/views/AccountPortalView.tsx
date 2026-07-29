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

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-8">

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
