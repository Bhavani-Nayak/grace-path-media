import LegalPageView from "@/components/views/LegalPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA / Copyright Policy",
  description: "Grace Path Media DMCA and Copyright Policy regarding original digital content and intellectual property.",
};

const content = `
<div class="p-5 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/40 mb-10 space-y-2">
  <p class="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Respecting Intellectual Property</p>
  <p class="text-base text-[#1a1d20] leading-relaxed font-medium">
    At Grace Path Media, we publish original, Scripture-centered eBooks and content. We deeply respect the rights of creators and respond promptly to legitimate copyright concerns.
  </p>
</div>

<h2>1. Our Commitment to Original Content</h2>
<p>We are dedicated to creating original Christian books, devotionals, articles, and graphics. We respect the work of writers, artists, and publishers, and we expect all visitors to respect copyright laws as well.</p>

<h2>2. How to Report a Copyright Concern</h2>
<p>If you are a copyright owner or authorized representative and believe that any material on our website infringes your copyright, please send a written email to our copyright team with the following simple information:</p>

<ol class="list-decimal pl-6 space-y-2">
  <li>Your full name and contact email address.</li>
  <li>A description of the copyrighted work you believe has been infringed.</li>
  <li>The exact link or webpage on our website where the material is located.</li>
  <li>A statement that you genuinely believe the use is unauthorized.</li>
  <li>A statement confirming that the information provided in your notice is accurate.</li>
</ol>

<h2>3. Our Review Process</h2>
<p>When we receive a copyright notice, our team will review it promptly within 24 to 48 hours. If a valid concern is confirmed, we will take appropriate action, such as updating or removing the content.</p>

<h2>4. Protection of Grace Path Media Books & Content</h2>
<p>All eBooks, articles, page layouts, cover designs, and graphics published on Grace Path Media are protected by copyright laws. Please do not copy, redistribute, or resell our eBooks or website content without written permission.</p>

<h2>5. Contact Our Copyright Team</h2>
<p>If you have any copyright questions or notices, please contact us:</p>
<p>
  <strong>Grace Path Media — Copyright Department</strong><br />
  Email: <a href="mailto:copyright@gracepathmedia.com" class="font-bold">copyright@gracepathmedia.com</a><br />
  General Contact: <a href="mailto:contact@gracepathmedia.com">contact@gracepathmedia.com</a><br />
  Website: <a href="https://gracepathmedia.com" target="_blank" rel="noopener noreferrer">https://gracepathmedia.com</a>
</p>
`;

export default function DMCAPage() {
  return (
    <LegalPageView
      title="DMCA / Copyright Policy"
      lastUpdated="July 26, 2026"
      content={content}
    />
  );
}
