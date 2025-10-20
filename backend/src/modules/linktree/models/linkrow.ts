import { model } from "@medusajs/framework/utils";

const Linkrow = model.define("linkrow", {
  id: model.id().primaryKey(),
  text: model.text(),
  href: model.text(),
  description: model.text(),
  order: model.number(),
  active: model.boolean(),
  category: model.text(),
  tags: model.array().nullable(),
  photo: model.text().nullable(),
});

export default Linkrow;
