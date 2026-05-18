import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const SITE_URL = process.env.SITE_URL ?? "https://amelielavie.org";

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
    inlineStylesheets: "auto",
  },
  image: {
    domains: ["cdn.sanity.io"],
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
});
