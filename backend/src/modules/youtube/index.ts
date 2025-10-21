import VideoModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const YOUTUBE_MODULE = "youtube";

export default Module(YOUTUBE_MODULE, {
  service: VideoModuleService,
});
