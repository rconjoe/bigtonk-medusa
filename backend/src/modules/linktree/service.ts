import { MedusaService } from "@medusajs/framework/utils";
import LinkRow from "./models/linkrow";

class LinkTreeModuleService extends MedusaService({
  LinkRow,
}) {}

export default LinkTreeModuleService;
