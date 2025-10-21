import Medusa from "@medusajs/js-sdk";

const IS_DEV = import.meta.env.NODE_ENV === "development";

const BACKEND_URL =
  import.meta.env.BACKEND_PUBLIC_URL ??
  import.meta.env.RAILWAY_PUBLIC_DOMAIN ??
  "http://localhost:9000";

export const sdk = new Medusa({
  baseUrl: BACKEND_URL,
  debug: IS_DEV,
  auth: {
    type: "session",
  },
});
