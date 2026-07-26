"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Mail,
  MapPin,
  Clock,
  Globe,
  Building2,
  Heart,
  Users,
  Sparkles,
  Tag,
  CheckCircle2,
} from "lucide-react";


interface ContactViewProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    slug?: string;
  };
  setField: (
    field: "name" | "email" | "subject" | "message" | "slug",
    value: string
  ) => void;
  submit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

const MESSAGE_SLUGS = [
  { value: "general-enquiry", label: "General Enquiry" },
  { value: "prayer-request", label: "Prayer Request" },
  { value: "technical-support", label: "Technical Support" },
  { value: "collaboration-partnerships", label: "Collaboration & Partnerships" },
  { value: "media-publications", label: "Media & Digital Publications" },
];

export default function ContactView({
  formData,
  setField,
  submit,
  isSubmitting,
  isSubmitted,
  error,
}: ContactViewProps) {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-12">
        {/* ─── Header ─── */}
        <div className="space-y-4 max-w-3xl">
          <Badge variant="gold" className="gap-1.5">
            <Sparkles size={14} className="text-[#c5a059]" />
            Get in Touch
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a1d20] tracking-tight">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] font-normal leading-relaxed">
            We would be delighted to hear from you. Whether you have a question about our digital resources, would like to share your testimony, submit a prayer request, report a technical issue, or simply connect with us, our team is here to help.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] font-normal">
            We value every message and appreciate the opportunity to serve and encourage believers from around the world.
          </p>
        </div>

        {/* ─── Main Content Grid: Contact Form & Get in Touch Sidebar ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact form */}
          <div className="lg:col-span-2">
            <GlassCard className="p-8 border border-[#c5a059]/30 bg-white shadow-lg space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#1a1d20] mb-1">
                  Send Us a Message
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] font-normal">
                  Have a question about one of our eBooks, digital resources, website, or publishing? We&apos;d love to hear from you. Please complete the form below.
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12 space-y-4 bg-[#fafaf7] rounded-2xl border border-[#c5a059]/30 p-8 shadow-sm">
                  <div className="h-14 w-14 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-[#1a1d20]">
                    Thank You!
                  </h3>
                  <p className="text-[var(--color-text-secondary)] font-medium max-w-md mx-auto text-base leading-relaxed">
                    Thank you for reaching out to Grace Path Media! We have received your message regarding <span className="font-bold text-[#c5a059]">&quot;{formData.slug || "general-enquiry"}&quot;</span> and our team will connect with you shortly.
                  </p>
                </div>
              ) : (

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#c5a059] mb-2 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) => setField("name", e.target.value)}
                        required
                        className="w-full bg-[#fafaf7] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#1a1d20] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#c5a059] mb-2 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={(e) => setField("email", e.target.value)}
                        required
                        className="w-full bg-[#fafaf7] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#1a1d20] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Message Topic / Slug Field */}
                  <div>
                    <label className="block text-xs font-bold text-[#c5a059] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag size={13} />
                      <span>Message Topic / Slug</span>
                    </label>
                    <select
                      id="contact-slug"
                      value={formData.slug || "general-enquiry"}
                      onChange={(e) => setField("slug", e.target.value)}
                      className="w-full bg-[#fafaf7] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#1a1d20] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all"
                    >
                      {MESSAGE_SLUGS.map((slugOpt) => (
                        <option key={slugOpt.value} value={slugOpt.value}>
                          {slugOpt.label} ({slugOpt.value})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#c5a059] mb-2 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setField("subject", e.target.value)}
                      required
                      className="w-full bg-[#fafaf7] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#1a1d20] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#c5a059] mb-2 uppercase tracking-wider">
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => setField("message", e.target.value)}
                      required
                      rows={5}
                      className="w-full bg-[#fafaf7] border border-black/15 rounded-xl px-4 py-3 text-sm text-[#1a1d20] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all resize-none"
                      placeholder="Write your message here..."
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="gold"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                  </Button>
                </form>
              )}
            </GlassCard>
          </div>

          {/* Info sidebar */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              Get in Touch Details
            </p>

            {[
              {
                icon: Mail,
                label: "Email",
                value: "contact@gracepathmedia.com",
                link: "mailto:contact@gracepathmedia.com",
              },
              {
                icon: Globe,
                label: "Website",
                value: "https://gracepathmedia.com",
                link: "https://gracepathmedia.com",
              },
              {
                icon: Building2,
                label: "Business Name",
                value: "Grace Path Media",
              },
              {
                icon: MapPin,
                label: "Location",
                value: "Jaipur, Rajasthan, India",
              },
              {
                icon: Clock,
                label: "Response Time",
                value: "We aim to respond to all genuine enquiries within 1–2 business days. During periods of high message volume, responses may take slightly longer.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <GlassCard key={item.label} className="p-4 flex items-start gap-3.5 border border-[#c5a059]/30 bg-white shadow-sm">
                  <div className="h-9 w-9 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/35 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#c5a059]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1a1d20] font-medium hover:underline hover:text-[#c5a059]">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-xs text-[var(--color-text-secondary)] font-normal leading-relaxed">
                        {item.value}
                      </p>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* ─── Prayer Requests & Collaboration Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <GlassCard className="p-8 border border-[#c5a059]/30 bg-white shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-[#c5a059]/15 border border-[#c5a059]/35 flex items-center justify-center shrink-0">
                <Heart size={20} className="text-[#c5a059]" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1a1d20]">
                Prayer Requests
              </h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
              If you would like us to pray for you or someone you care about, you are welcome to share your prayer request through the contact form using topic <span className="font-semibold text-[#c5a059]">&quot;prayer-request&quot;</span>.
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-normal">
              While we may not be able to respond personally to every request, every prayer request is received with care and is sincerely appreciated. It is our privilege to stand with you in prayer and encourage you through God&apos;s Word.
            </p>
          </GlassCard>

          <GlassCard className="p-8 border border-[#c5a059]/30 bg-white shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-[#c5a059]/15 border border-[#c5a059]/35 flex items-center justify-center shrink-0">
                <Users size={20} className="text-[#c5a059]" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#1a1d20]">
                Collaboration & Support
              </h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
              If you would like to discuss partnerships, media enquiries, speaking opportunities, content collaborations, or questions regarding our digital publications, please contact us using topic <span className="font-semibold text-[#c5a059]">&quot;collaboration-partnerships&quot;</span>.
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-normal">
              We welcome opportunities to serve individuals, churches, communities, and organizations around the world.
            </p>
          </GlassCard>
        </div>

        {/* ─── Stay Connected Footer Banner ─── */}
        <div className="text-center pt-8 max-w-2xl mx-auto space-y-3">
          <p className="text-sm font-semibold text-[#1a1d20]">
            Continue exploring our collection of Scripture-centered eBooks, devotionals, and biblical resources by visiting:
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#c5a059]">
            <a href="https://gracepathmedia.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              https://gracepathmedia.com
            </a>
            <span>•</span>
            <a href="mailto:contact@gracepathmedia.com" className="hover:underline">
              contact@gracepathmedia.com
            </a>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#c5a059] pt-2">
            Grace Path Media — Inspiring Faith. Impacting Lives.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}



