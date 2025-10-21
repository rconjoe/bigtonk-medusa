import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  updateLinkrowWorkflow,
  UpdateLinkrowWorkflowInput,
} from "../../../workflows/update-linkrow";

export async function POST(
  req: MedusaRequest<UpdateLinkrowWorkflowInput>,
  res: MedusaResponse,
) {
  const input = req.body;
  const { result: linkrow } = await updateLinkrowWorkflow(req.scope).run({
    input,
  });

  res.json({
    linkrow,
  });
}
