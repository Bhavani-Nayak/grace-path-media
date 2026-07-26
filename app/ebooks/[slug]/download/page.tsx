"use client";

import { use, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDownloadViewModel } from "@/viewmodels/useDownloadViewModel";
import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Download, CheckCircle, FileText, Lock, Sparkles, LogIn } from "lucide-react";
import { signInWithGoogle } from "@/services/auth-service";

function DownloadContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const vm = useDownloadViewModel(slug, token);

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        {vm.isLoading && <LoadingSpinner className="py-12" />}

        {!vm.isLoading && vm.isOwned && (
          <GlassCard className="p-8 sm:p-12 border border-[#c5a059]/40 bg-white shadow-2xl space-y-6">
            <div className="h-20 w-20 rounded-2xl bg-[#c5a059]/15 border border-[#c5a059]/40 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle size={36} className="text-[#c5a059]" />
            </div>

            <div className="space-y-2">
              <Badge variant="gold" className="gap-1.5">
                <Sparkles size={13} className="text-[#c5a059]" />
                Access Granted
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1d20] tracking-tight">
                {vm.title ?? "Your Purchased eBook"}
              </h1>
              <p className="text-[#c5a059] font-medium text-sm">
                Verified Owner: {vm.user?.email ?? "Authenticated User"}
              </p>
            </div>

            <p className="text-[var(--color-text-secondary)] text-sm sm:text-base font-normal leading-relaxed">
              Your eBook ownership has been verified and linked to your account. Click below to download your PDF file.
            </p>

            <div className="space-y-3 pt-2">
              {vm.downloadUrl && (
                <a
                  href={vm.downloadUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-4 rounded-xl text-base font-bold bg-[#c5a059] text-white hover:bg-[#b38f38] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Download size={20} />
                  Download PDF eBook
                </a>
              )}

              {vm.invoiceUrl && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={vm.invoiceUrl.replace('format=html', 'format=pdf')}
                    download
                    className="inline-flex items-center justify-center gap-2.5 flex-1 px-6 py-3 rounded-xl text-sm font-semibold bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059]/20 border border-[#c5a059]/30 transition-all"
                  >
                    <Download size={16} />
                    Download PDF Invoice
                  </a>
                  <a
                    href={vm.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 flex-1 px-6 py-3 rounded-xl text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-all"
                  >
                    <FileText size={16} />
                    View Invoice Online
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-black/5 flex items-center justify-center gap-4">
              <Button href="/ebooks" variant="gold-outline" size="sm">
                ← Back to Catalog
              </Button>
            </div>
          </GlassCard>
        )}

        {!vm.isLoading && !vm.isOwned && (
          <GlassCard className="p-8 sm:p-12 border border-red-200 bg-white shadow-xl space-y-6">
            <div className="h-16 w-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
              <Lock size={28} className="text-red-500" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1d20]">
                Purchase Required
              </h1>
              <p className="text-red-600 text-sm font-medium">
                {vm.error ?? "No valid purchase record found for this account."}
              </p>
            </div>

            {!vm.user ? (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-slate-500">
                  If you already purchased this eBook, please sign in with the Firebase account you used at checkout:
                </p>
                <Button
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                    } catch (err) {
                      console.error("Sign in error:", err);
                    }
                  }}
                  variant="gold"
                  className="w-full gap-2"
                >
                  <LogIn size={18} />
                  Sign In with Google
                </Button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-500">
                  Logged in as: <strong className="text-slate-800">{vm.user.email}</strong>
                </p>
                <Button href={`/ebooks/${slug}`} variant="gold" className="w-full">
                  Purchase eBook Now
                </Button>
              </div>
            )}

            <div className="pt-2">
              <Button href="/ebooks" variant="gold-outline" size="sm">
                Return to eBooks Store
              </Button>
            </div>
          </GlassCard>
        )}
      </div>
    </PageWrapper>
  );
}

export default function EbookDownloadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <Suspense>
      <DownloadContent slug={slug} />
    </Suspense>
  );
}
