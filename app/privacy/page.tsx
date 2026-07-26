import LegalPageView from "@/components/views/LegalPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Grace Path Media Privacy Policy — how we respect and protect your personal information.",
};

const content = `
<div class="p-5 rounded-2xl bg-[#FAF5E8] border border-[#c5a059]/40 mb-10 space-y-2">
  <p class="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Our Privacy Promise</p>
  <p class="text-base text-[#1a1d20] leading-relaxed font-medium">
    At Grace Path Media, your trust means everything to us. We only collect the minimal information needed to deliver your digital eBook orders, respond to your messages, and support your experience on our website. We never sell or share your personal data with third-party advertisers.
  </p>
</div>

<h2>1. Our Commitment to You</h2>
<p>We believe that sharing faith-centered resources requires complete honesty and transparency. This Privacy Policy explains what information we collect when you visit our website, purchase eBooks, or contact us, and how we keep your information safe and private.</p>

<h2>2. Information You Share With Us</h2>
<p>You may choose to share information with us in a few simple ways:</p>

<h3>Account & Sign-In Details</h3>
<p>When you sign in to access your purchased eBooks or account library, we receive basic profile details such as your name and email address to link your purchases to your account.</p>

<h3>Messages & Contact Requests</h3>
<p>If you contact us through our website or send a prayer request, we receive your name, email address, and message so that our team can respond to you.</p>

<h3>Purchase & Download History</h3>
<p>When you purchase an eBook, we keep a record of the items you bought so you can re-download them anytime from your account library.</p>

<h2>3. How We Protect Payment Security</h2>
<p>All payments and voluntary mission contributions are processed through secure, industry-standard payment providers like PayPal.</p>
<p><strong>We never see, store, or save your credit card numbers, debit card details, or banking information on our servers.</strong></p>

<h2>4. How We Use Your Information</h2>
<p>Your information is used strictly to serve you:</p>
<ul>
  <li>To deliver your purchased digital eBooks and send order receipts.</li>
  <li>To allow you to log in and access your saved library of downloads.</li>
  <li>To reply to your questions, prayer requests, and feedback.</li>
  <li>To maintain website security and prevent fraud.</li>
</ul>

<h2>5. Website Cookies & Preferences</h2>
<p>We use standard, simple website cookies to remember your sign-in session and keep the website running smoothly. You can disable cookies in your web browser at any time, though some account features may require them to function properly.</p>

<h2>6. Your Privacy Rights & Choices</h2>
<p>You have full control over your personal information:</p>
<ul>
  <li><strong>View Your Data:</strong> You can view your saved purchases anytime by logging into your account.</li>
  <li><strong>Update or Delete:</strong> You may request to update your details or ask us to delete your account and personal records at any time.</li>
  <li><strong>Unsubscribe:</strong> You can unsubscribe from optional email updates whenever you choose.</li>
</ul>

<h2>7. Children's Privacy</h2>
<p>Our website is created for a general audience. We do not knowingly collect or request personal information from children under the age of 13.</p>

<h2>8. Contact Us About Your Privacy</h2>
<p>If you have any questions about this Privacy Policy or wish to request changes to your personal information, please reach out to us:</p>
<p>
  <strong>Grace Path Media — Customer Support</strong><br />
  Website: <a href="https://gracepathmedia.com" target="_blank" rel="noopener noreferrer">https://gracepathmedia.com</a><br />
  Email: <a href="mailto:contact@gracepathmedia.com">contact@gracepathmedia.com</a>
</p>
`;

export default function PrivacyPage() {
  return (
    <LegalPageView
      title="Privacy Policy"
      lastUpdated="July 26, 2026"
      content={content}
    />
  );
}
