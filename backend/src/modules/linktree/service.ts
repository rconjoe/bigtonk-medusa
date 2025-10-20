import { MedusaService } from "@medusajs/framework/utils";
import Linkrow from "./models/linkrow";

class LinkTreeModuleService extends MedusaService({
  Linkrow,
}) { }

export default LinkTreeModuleService;
