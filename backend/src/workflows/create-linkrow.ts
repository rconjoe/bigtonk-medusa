import { InferTypeOf } from "@medusajs/framework/types";
import LinkRow from "../modules/linktree/models/linkrow";
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import LinkTreeModuleService from "modules/linktree/service";
import { LINKTREE_MODULE } from "modules/linktree";

type LinkTreeRow = InferTypeOf<typeof LinkRow>;

export type CreateLinkrowWorkflowInput = Omit<
  LinkTreeRow,
  "id" | "created_at" | "updated_at" | "deleted_at" | "photo" | "tags"
>;

const createLinkrowStep = createStep(
  "create-linkrow",
  async (linkrowInput: CreateLinkrowWorkflowInput, { container }) => {
    const linktreeModuleService: LinkTreeModuleService =
      container.resolve(LINKTREE_MODULE);

    const linkrow = await linktreeModuleService.createLinkRows({
      ...linkrowInput,
    });

    return new StepResponse(linkrow, linkrow);
  },
  async (linkrow, { container }) => {
    const linktreeModuleService: LinkTreeModuleService =
      container.resolve(LINKTREE_MODULE);

    await linktreeModuleService.deleteLinkRows(linkrow.id);
  },
);

export const createLinkrowWorkflow = createWorkflow(
  "create-linkrow",
  (linkrowInput: CreateLinkrowWorkflowInput) => {
    const linkrow = createLinkrowStep(linkrowInput);

    return new WorkflowResponse(linkrow);
  },
);
