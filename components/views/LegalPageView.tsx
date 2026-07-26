import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";

interface LegalPageViewProps {
  title: string;
  lastUpdated: string;
  content: string;
}

export default function LegalPageView({
  title,
  lastUpdated,
  content,
}: LegalPageViewProps) {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="mb-10 space-y-3">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a1d20] tracking-tight leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#c5a059]"></span>
            <p className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        <GlassCard className="p-8 sm:p-12 border border-[#c5a059]/30 bg-white shadow-xl rounded-3xl">
          <div
            className="legal-content prose prose-slate max-w-none
              prose-p:text-[#3a3f47] prose-p:text-base prose-p:leading-relaxed prose-p:font-normal
              prose-li:text-[#3a3f47] prose-li:text-base prose-li:my-1.5
              prose-strong:text-[#1a1d20] prose-strong:font-bold
              prose-a:text-[#c5a059] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#b38f38]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
