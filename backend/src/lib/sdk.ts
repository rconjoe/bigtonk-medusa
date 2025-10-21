import Medusa from "@medusajs/js-sdk";

// const IS_DEV = "development";

const BACKEND_URL = "https://medusa.bigtonk.com";

export const sdk = new Medusa({
  baseUrl: BACKEND_URL,
  debug: false,
  auth: {
    type: "session",
  },
});
