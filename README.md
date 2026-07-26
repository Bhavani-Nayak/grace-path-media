# Grace Path Media

A responsive, multi-page digital media website selling ebooks, video content, and a paid membership. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Firebase** (Auth, Firestore, Storage, Cloud Functions), and **PayPal** for payments.

## Architecture — MVVM

The codebase follows Model–View–ViewModel throughout:

- **Model** (`/models`, `/services`) — TypeScript types + data-access layer (Firestore, Storage, PayPal API).
- **ViewModel** (`/viewmodels`) — Custom hooks per page/feature. Own state, call services, return a typed interface. No JSX.
- **View** (`/components/views`, `/app/**/page.tsx`) — Presentational components that receive data + callbacks as props.

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Firebase project** — Create one at [console.firebase.google.com](https://console.firebase.google.com)
  - Enable **Authentication** (Email/Password)
  - Create a **Firestore** database
  - Enable **Storage**
  - ⚠️ **Cloud Functions and Cloud Storage require the Blaze (pay-as-you-go) plan.** Usage should stay within the free monthly quota for a small site.
- **PayPal Developer account** — Create an app at [developer.paypal.com](https://developer.paypal.com/dashboard/applications)

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url> grace-path-media
cd grace-path-media
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your real Firebase and PayPal credentials. See the comments in `.env.local.example` for where to get each value.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Seed Firestore (optional)

Sample ebook and blog post data is in `lib/seed-data.ts`. You can import and write these to Firestore using a one-off script or the Firebase console.

### 5. Set up PayPal webhooks

1. In the PayPal Developer Dashboard, go to **Webhooks**.
2. Add a webhook URL: `https://your-domain.com/api/paypal/webhook`
3. Subscribe to events: `PAYMENT.CAPTURE.COMPLETED`, `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.UPDATED`, `BILLING.SUBSCRIPTION.CANCELLED`
4. Copy the Webhook ID into your `PAYPAL_WEBHOOK_ID` env var.

### 6. Deploy Firebase rules

```bash
npx firebase deploy --only firestore:rules,storage
```

### 7. Deploy Cloud Functions (requires Blaze plan)

```bash
cd functions
npm install
cd ..
npx firebase deploy --only functions
```

## Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # API route handlers (PayPal, downloads, contact)
│   ├── ebooks/             # Ebook catalog + [slug] detail pages
│   ├── blog/               # Blog listing + [slug] detail pages
│   └── ...                 # All other routes
├── components/
│   ├── layout/             # Navbar, Footer, PageWrapper
│   ├── ui/                 # FadingVideo, BlurText, GlassCard, Badge, Button
│   └── views/              # Page-level presentational components
├── models/                 # TypeScript domain types
├── services/               # Data-access layer (Firebase, PayPal)
├── viewmodels/             # Custom hooks (one per page/feature)
├── lib/                    # Utilities (rate-limit, env validation, seed data)
├── functions/              # Firebase Cloud Functions
├── firestore.rules         # Firestore security rules (default-deny)
├── storage.rules           # Storage security rules (default-deny)
└── .env.local.example      # Environment variable placeholders
```

## Key Design Decisions

- **Prices are stored in Firestore in cents** (e.g. 999 = $9.99) and never trusted from the client.
- **PayPal webhook verification** uses the `verify-webhook-signature` API call — not a local HMAC check.
- **All writes are idempotent** — a retried webhook can't double-grant or double-count.
- **Downloads use signed URLs** with 15-minute expiry — PDFs are never at a public path.
- **Security rules are default-deny** — only opened per collection based on auth + ownership.

## License

All content © Grace Path Media. All rights reserved.
