import { model } from "@medusajs/framework/utils";

const Video = model.define("video", {
  id: model.id(),
  videoid: model.text(),
  type: model.text(),
  title: model.text(),
  thumbnail: model.text(),
  order: model.number(),
});

export default Video;
