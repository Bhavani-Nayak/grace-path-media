"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Download, LogOut, Trash2, User as UserIcon, AlertTriangle, FileText } from "lucide-react";
import type { User } from "firebase/auth";

import { formatAuthError } from "@/lib/firebase-error-parser";

interface DownloadItem {
  productId: string;
  title: string;
  coverUrl: string;
}

interface DownloadsViewProps {
  user: User | null;
  purchases: DownloadItem[];
  isLoading: boolean;
  error: string | null;
  getDownloadUrl: (productId: string) => Promise<string | null>;
  signOut?: () => Promise<void>;
  deleteAccount?: () => Promise<void>;
}

export default function DownloadsView({
  user,
  purchases,
  isLoading,
  error,
  getDownloadUrl,
  signOut,
  deleteAccount,
}: DownloadsViewProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleSignOut = async () => {
    if (!signOut) return;
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      setActionError(formatAuthError(err));
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccount) return;
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

  if (!user) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto px-6 py-32 text-center space-y-4">
          <Badge variant="gold">My Account</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#1a1d20]">
            My Downloads & Library
          </h1>
          <p className="text-[var(--color-text-secondary)] font-normal">
            Sign in to access your purchased ebooks and account settings.
          </p>
          <Button href="/login" variant="gold" size="lg">
            Sign In Now
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header & User Info */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-black/10">
          <div className="space-y-2">
            <Badge variant="gold">Account & Library</Badge>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#1a1d20]">
              My Purchases & Downloads
            </h1>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] font-medium">
              <UserIcon size={16} className="text-[#c5a059]" />
              <span>{user.email || user.displayName || "Authenticated User"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {signOut && (
              <Button
                onClick={handleSignOut}
                variant="gold-outline"
                size="sm"
                className="gap-2"
                id="btn-signout"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            )}

            {deleteAccount && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shadow-xs"
                id="btn-delete-account"
              >
                <Trash2 size={14} />
                Delete Account
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <p className="text-sm text-red-700 mb-6 bg-red-50 p-4 rounded-xl border border-red-200 font-medium">
            {actionError}
          </p>
        )}

        {isLoading && <LoadingSpinner className="py-20" />}
        {error && <p className="text-red-700 mb-8 font-medium">{error}</p>}

        {!isLoading && purchases.length === 0 && (
          <GlassCard className="p-12 text-center border border-[#c5a059]/30 bg-white space-y-4 shadow-md">
            <div className="h-16 w-16 rounded-full bg-[#FAF5E8] border border-[#c5a059]/30 flex items-center justify-center mx-auto text-[#c5a059]">
              <Download size={28} />
            </div>
            <p className="text-[var(--color-text-secondary)] font-normal">
              You haven&apos;t purchased any ebooks yet.
            </p>
            <Button href="/ebooks" variant="gold-outline">
              Browse Ebooks Catalog
            </Button>
          </GlassCard>
        )}

        <div className="space-y-4">
          {purchases.map((item) => (
            <GlassCard
              key={item.productId}
              className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 border border-[#c5a059]/30 bg-white hover-gold-glow shadow-md"
            >
              {/* Cover thumbnail */}
              <div className="h-16 w-12 rounded-xl bg-gradient-to-br from-[#FAF5E8] to-[#F5EFE0] border border-[#c5a059]/40 flex items-center justify-center shrink-0 shadow-xs">
                <span className="font-heading text-xl font-bold text-[#c5a059]">
                  {item.title.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-xl font-bold text-[#1a1d20] truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-normal mt-0.5">
                  Instant PDF Download • Lifetime Access
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  onClick={async () => {
                    try {
                      setDownloadingId(item.productId);
                      setActionError(null);
                      const url = await getDownloadUrl(item.productId);
                      if (url) {
                        window.open(url, "_blank");
                      } else {
                        setActionError("Download link generation failed. Please try again.");
                      }
                    } catch (err) {
                      setActionError(err instanceof Error ? err.message : "Failed to download.");
                    } finally {
                      setDownloadingId(null);
                    }
                  }}
                  variant="gold"
                  size="sm"
                  disabled={downloadingId === item.productId}
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

                {/* Lifetime Invoice View & Download Buttons */}
                <a
                  href={`/api/invoices/${item.productId}?uid=${user.uid}&format=html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border border-[#c5a059]/60 text-[#1a1d20] bg-white hover:bg-[#FAF5E8] transition-colors shadow-xs"
                >
                  <FileText size={14} className="text-[#c5a059]" />
                  View Invoice
                </a>

                <a
                  href={`/api/invoices/${item.productId}?uid=${user.uid}&format=pdf`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border border-[#c5a059]/60 text-[#1a1d20] bg-white hover:bg-[#FAF5E8] transition-colors shadow-xs"
                >
                  <Download size={14} className="text-[#c5a059]" />
                  Invoice PDF
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <GlassCard className="max-w-md w-full p-8 space-y-6 border border-red-300 bg-white shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 rounded-full bg-red-100 border border-red-200">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-[#1a1d20]">Delete Account?</h2>
                <p className="text-xs text-red-600 font-medium">This action is permanent.</p>
              </div>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-normal">
              Are you sure you want to delete your account? You will lose access to your account and saved downloads library.
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
                {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </PageWrapper>
  );
}
