import type { NextConfig } from "next";
import path from "path";

const firebaseAdminStub = path.resolve(process.cwd(), "lib/stubs/firebase-admin-stub.js");
const cloudinaryStub = path.resolve(process.cwd(), "lib/stubs/cloudinary-stub.js");
const protobufSafeShim = path.resolve(process.cwd(), "lib/protobufjs-codegen-safe.js");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Turbopack config (Next.js 16+ default for `next dev`).
  // Mirrors the webpack aliases below so both bundlers resolve stubs correctly.
  turbopack: {
    resolveAlias: {
      "@protobufjs/codegen": protobufSafeShim,
      // Server-only stubs — Turbopack applies these universally;
      // the webpack config gates them on isServer for finer control.
      "firebase-admin/app": firebaseAdminStub,
      "firebase-admin/firestore": firebaseAdminStub,
      "firebase-admin/storage": firebaseAdminStub,
      "firebase-admin/auth": firebaseAdminStub,
      "firebase-admin": firebaseAdminStub,
      cloudinary: cloudinaryStub,
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Redirect @protobufjs/codegen to our safe shim that wraps Function()
    // in try-catch, preventing EvalError in Cloudflare Workers.
    config.resolve.alias["@protobufjs/codegen"] = protobufSafeShim;

    if (isServer) {
      // Stub out heavy server-side packages to reduce Cloudflare Worker bundle size.
      // Each of these has graceful fallbacks in our service layer:
      // - firebase-admin → services/firebase-admin.ts falls back to in-memory mock
      // - cloudinary → lib/cloudinary.ts returns "" when unavailable
      // - jspdf → services/invoice-pdf.ts is only called from API routes
      config.resolve.alias["firebase-admin/app"] = firebaseAdminStub;
      config.resolve.alias["firebase-admin/firestore"] = firebaseAdminStub;
      config.resolve.alias["firebase-admin/storage"] = firebaseAdminStub;
      config.resolve.alias["firebase-admin/auth"] = firebaseAdminStub;
      config.resolve.alias["firebase-admin"] = firebaseAdminStub;
      config.resolve.alias["cloudinary"] = cloudinaryStub;
    }

    return config;
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(png|jpg|jpeg|svg|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;


import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
