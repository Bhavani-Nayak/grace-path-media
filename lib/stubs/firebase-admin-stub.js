// Stub module for firebase-admin/* packages in Cloudflare Workers.
// The real firebase-admin SDK is too large for Workers (pulls in protobufjs, google-gax, gRPC).
// services/firebase-admin.ts already has mock fallbacks that handle this gracefully.

function notAvailable() {
  throw Object.assign(new Error("firebase-admin is not available in this environment"), {
    code: "MODULE_NOT_FOUND",
  });
}

module.exports = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === "__esModule") return false;
      if (prop === "default") return module.exports;
      return notAvailable;
    },
  }
);
