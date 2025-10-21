import { InferTypeOf } from "@medusajs/framework/types";
import Linkrow from "../modules/linktree/models/linkrow";
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import LinkTreeModuleService from "modules/linktree/service";
import { LINKTREE_MODULE } from "modules/linktree";

type LinkTreeRow = InferTypeOf<typeof Linkrow>;

export type UpdateLinkrowWorkflowInput = Omit<
  LinkTreeRow,
  "created_at" | "updated_at" | "deleted_at" | "photo" | "tags"
>;

const updateLinkrowStep = createStep(
  "update-linkrow",
  async (linkrowInput: UpdateLinkrowWorkflowInput, { container }) => {
    const linktreeModuleService: LinkTreeModuleService =
      container.resolve(LINKTREE_MODULE);

    const linkrow = await linktreeModuleService.updateLinkrows({
      ...linkrowInput,
    });

    return new StepResponse(linkrow, linkrow);
  },
);

export const updateLinkrowWorkflow = createWorkflow(
  "update-linkrow",
  (linkrowInput: UpdateLinkrowWorkflowInput) => {
    const linkrow = updateLinkrowStep(linkrowInput);

    return new WorkflowResponse(linkrow);
  },
);
