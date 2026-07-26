import LegalPageView from "@/components/views/LegalPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Grace Path Media Terms of Service governing the use of our website and digital resources.",
};

const content = `
<div class="p-5 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/40 mb-10 space-y-2">
  <p class="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Welcome to Grace Path Media</p>
  <p class="text-base text-[#1a1d20] leading-relaxed font-medium">
    By using our website, purchasing our eBooks, or supporting our mission, you agree to these clear and simple terms.
  </p>
</div>

<h2>1. Welcome and Agreement</h2>
<p>These Terms of Service outline the guidelines for using the Grace Path Media website (gracepathmedia.com) and accessing our digital books, devotionals, and resources.</p>
<p>By using our website or downloading our resources, you agree to follow these guidelines.</p>

<h2>2. Our Digital Books & Content</h2>
<p>Grace Path Media creates and publishes faith-centered eBooks, devotionals, study materials, and articles designed for quiet reading, reflection, and spiritual encouragement.</p>

<h2>3. Single-User License for eBook Downloads</h2>
<p>When you purchase an eBook from Grace Path Media, you receive a personal license to download and read the file on your personal devices (such as your phone, tablet, or computer).</p>

<div class="p-4 rounded-xl bg-white border border-[#c5a059]/40 my-6 shadow-sm">
  <p class="text-xs font-bold text-[#1a1d20] uppercase tracking-wider">Personal Use Guidelines</p>
  <p class="text-xs text-[var(--color-text-secondary)] mt-1">
    Your eBook purchase is for your own personal reading. You may not re-sell, distribute, copy for commercial purposes, or post our eBook files publicly on other websites.
  </p>
</div>

<h2>4. Digital Deliveries & Instant Access</h2>
<p>All eBook purchases are delivered digitally right after checkout and remain accessible anytime through your account download library.</p>
<p>For products offered under "Pay As You Want", you have the freedom to choose your desired purchase amount.</p>

<h2>5. Support Our Mission Program</h2>
<p>Contributions made under our "Support Our Mission" program are voluntary gifts that help fund the creation, publishing, and global sharing of faith-based content.</p>
<p>Voluntary support gifts are completely optional and are not purchases of company shares or business ownership.</p>

<h2>6. Responsible Website Use</h2>
<p>We ask all visitors to use our website respectfully. Please do not attempt to disrupt the site, post harmful material, or misuse our services.</p>

<h2>7. Disclaimer & General Purpose</h2>
<p>Our resources are created to inspire faith, encourage prayer, and support personal growth. They are provided for spiritual encouragement and educational reading, and do not replace professional medical, legal, or financial guidance.</p>

<h2>8. Governing Law</h2>
<p>These Terms are guided by the laws of India, with any legal matters addressed through the competent courts in Jaipur, Rajasthan, India.</p>

<h2>9. Contact Us</h2>
<p>If you have any questions regarding these Terms of Service, please feel free to reach out:</p>
<p>
  <strong>Grace Path Media — Customer Support</strong><br />
  Website: <a href="https://gracepathmedia.com" target="_blank" rel="noopener noreferrer">https://gracepathmedia.com</a><br />
  Email: <a href="mailto:contact@gracepathmedia.com">contact@gracepathmedia.com</a>
</p>
`;

export default function TermsPage() {
  return (
    <LegalPageView
      title="Terms of Service"
      lastUpdated="July 26, 2026"
      content={content}
    />
  );
}
