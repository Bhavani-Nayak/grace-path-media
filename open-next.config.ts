import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig({
  buildCommand: "npm run build:next",
});
config.default.minify = true;

export default config;
