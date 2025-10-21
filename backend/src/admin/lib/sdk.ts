import Medusa from "@medusajs/js-sdk";

// const BACKEND_URL = "https://medusa.bigtonk.com";
// const BACKEND_URL = "http://localhost:9000";

const IS_DEV = process.env.NODE_ENV === "development";

// @ts-ignore
const BACKEND_URL = import.meta.env.VITE_RAILWAY_PUBLIC_DOMAIN;

export const sdk = new Medusa({
  baseUrl: BACKEND_URL,
  debug: IS_DEV,
  auth: {
    type: "session",
  },
});
