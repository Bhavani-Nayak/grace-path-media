import LegalPageView from "@/components/views/LegalPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Support Policy",
  description: "Grace Path Media Refund & Support Policy for digital purchases and voluntary mission contributions.",
};

const content = `
<div class="p-5 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/40 mb-10 space-y-2">
  <p class="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Simple & Clear Refund Policy</p>
  <p class="text-base text-[#1a1d20] leading-relaxed font-medium">
    Because our eBooks are delivered instantly to your device as downloadable files, sales are generally final. However, if you experience a technical download problem or accidental duplicate charge, we are here to help and fix it quickly!
  </p>
</div>

<h2>1. Instant Digital Delivery</h2>
<p>When you purchase an eBook on Grace Path Media, you get instant access to download your PDF book right after checkout and from your account library anytime.</p>

<h2>2. How Refunds Work</h2>
<p>Because digital eBooks can be downloaded immediately to your device, purchases are generally non-refundable once the file has been delivered.</p>
<p>However, we value customer care and will happily review and approve refunds within <strong>14 days of purchase</strong> for the following reasons:</p>

<ul>
  <li><strong>Accidental Duplicate Charge:</strong> You were charged twice for the same book by mistake.</li>
  <li><strong>Technical Download Issue:</strong> You experienced a technical problem preventing you from receiving or opening your book, and our support team could not resolve it for you.</li>
  <li><strong>Verified Payment Error:</strong> An unauthorized or accidental billing issue confirmed by your payment provider.</li>
</ul>

<h2>3. Support Our Mission Voluntary Contributions</h2>
<p>Gifts made through our "Support Our Mission" program help fund our writing, publishing, and global sharing of faith-based content. Because these contributions directly support ongoing outreach, they are generally non-refundable.</p>
<p>If you made a typing mistake with your contribution amount during checkout, please contact us within 48 hours and we will gladly correct or refund it for you.</p>

<h2>4. Easy 3-Step Refund Request Process</h2>
<p>If you need assistance with an order, simply follow these steps:</p>
<ol class="list-decimal pl-6 space-y-2">
  <li>Find your order details (your <strong>Full Name</strong>, <strong>Email Address</strong>, and <strong>Order Receipt Number</strong>).</li>
  <li>Send an email to <a href="mailto:contact@gracepathmedia.com" class="font-bold underline">contact@gracepathmedia.com</a> explaining what happened.</li>
  <li>Our friendly team will reply within <strong>1 to 3 business days</strong> to assist you or process your refund.</li>
</ol>

<h2>5. Contact Customer Support</h2>
<p>If you ever have questions about your downloads or order receipts, please reach out to us anytime:</p>
<p>
  <strong>Grace Path Media — Customer Support</strong><br />
  Website: <a href="https://gracepathmedia.com" target="_blank" rel="noopener noreferrer">https://gracepathmedia.com</a><br />
  Email: <a href="mailto:contact@gracepathmedia.com">contact@gracepathmedia.com</a>
</p>
`;

export default function RefundPolicyPage() {
  return (
    <LegalPageView
      title="Refund & Support Policy"
      lastUpdated="July 26, 2026"
      content={content}
    />
  );
}
