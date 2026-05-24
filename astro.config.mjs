import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const SITE_URL = process.env.PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://amelielavie.com";

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  output: "static",
  integrations: [
    react({
      include: ["**/islands/**", "**/*.island.{tsx,jsx}"],
    }),
    sitemap({
      filter: (page) => !page.includes("/preview/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    assets: "_assets",
    // Inline 100% du CSS dans le <head> : évite la requête bloquante (perf
    // Lighthouse) — Tailwind v4 + tree-shaking gardent le CSS < 50 KB par page.
    inlineStylesheets: "always",
  },
  image: {
    domains: ["cdn.sanity.io"],
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
});
