import LinkTreeModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const LINKTREE_MODULE = "linktree";

export default Module(LINKTREE_MODULE, {
  service: LinkTreeModuleService,
});
