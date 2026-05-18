/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_API_VERSION: string;
  readonly PUBLIC_SANITY_STUDIO_URL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_RECAPTCHA_KEY: string;
  readonly PUBLIC_MAILCHIMP_ENDPOINT: string;

  readonly SANITY_API_READ_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
