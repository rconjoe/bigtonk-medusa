import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { syncYoutubeWorkflow } from "workflows/sync-youtube";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const videos = await query.graph({
    entity: "video",
    fields: ["id", "videoid", "type", "title", "thumbnail", "order"],
  });

  res.json({ videos });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const videos = await syncYoutubeWorkflow(req.scope).run();
  res.json(videos);
}
