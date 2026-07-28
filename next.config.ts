import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Redirect @protobufjs/codegen to our safe shim that wraps Function()
    // in try-catch, preventing EvalError in Cloudflare Workers.
    config.resolve.alias["@protobufjs/codegen"] = path.resolve(
      process.cwd(),
      "lib/protobufjs-codegen-safe.js"
    );

    if (isServer) {
      // Stub out heavy server-side packages to reduce Cloudflare Worker bundle size.
      // Each of these has graceful fallbacks in our service layer:
      // - firebase-admin → services/firebase-admin.ts falls back to in-memory mock
      // - cloudinary → lib/cloudinary.ts returns "" when unavailable
      // - jspdf → services/invoice-pdf.ts is only called from API routes
      const firebaseAdminStub = path.resolve(process.cwd(), "lib/stubs/firebase-admin-stub.js");
      const cloudinaryStub = path.resolve(process.cwd(), "lib/stubs/cloudinary-stub.js");

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
