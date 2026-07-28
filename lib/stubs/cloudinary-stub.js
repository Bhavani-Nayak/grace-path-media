// Stub module for cloudinary in Cloudflare Workers.
// lib/cloudinary.ts already returns "" when getCloudinaryInstance() returns null.

module.exports = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === "__esModule") return false;
      if (prop === "default") return module.exports;
      if (prop === "v2")
        return {
          config: function () {},
          url: function () {
            return "";
          },
          utils: {
            private_download_url: function () {
              return "";
            },
          },
        };
      return undefined;
    },
  }
);
