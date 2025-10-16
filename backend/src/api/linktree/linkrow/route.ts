import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createLinkrowWorkflow,
  CreateLinkrowWorkflowInput,
} from "../../../workflows/create-linkrow";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function POST(
  req: MedusaRequest<CreateLinkrowWorkflowInput>,
  res: MedusaResponse,
) {
  const input = req.body;
  const { result: linkrow } = await createLinkrowWorkflow(req.scope).run({
    input,
  });

  res.json({
    linkrow,
  });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data } = await query.graph({
    entity: "linkrow",
    fields: [
      "id",
      "text",
      "description",
      "href",
      "order",
      "active",
      "category",
    ],
  });

  res.json({ data });
}
