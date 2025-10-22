import { MedusaContainer } from "@medusajs/framework/types";
import { syncYoutubeWorkflow } from "../workflows/sync-youtube";

export default async function syncProductsJob(container: MedusaContainer) {
  const logger = container.resolve("logger");
  logger.log("Youtube sync starting...");
  await syncYoutubeWorkflow(container).run();
  logger.log("Youtube sync complete!");
}

export const config = {
  name: "sync-youtube-job",
  schedule: "0 */12 * * *",
};
