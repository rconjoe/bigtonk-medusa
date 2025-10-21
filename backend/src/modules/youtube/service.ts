import { MedusaService } from "@medusajs/framework/utils";
import Video from "./models/video";

class YoutubeModuleService extends MedusaService({
  Video,
}) { }

export default YoutubeModuleService;
