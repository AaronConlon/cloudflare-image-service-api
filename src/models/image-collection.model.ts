import {
  genModelToZodSchema,
  zodField,
} from "@/shared/utils/z-field.decorator";
import { z } from "@hono/zod-openapi";
import { ulid } from "ulid";
import { BaseModel } from "./_base.model";
import { ImageModel } from "./image.model";
import { UserModel } from "./user.model";

export class ImageCollectionModel extends BaseModel {
  table = "image_collections";
  hidden = ["deleted_at"];

  newUniqueId() {
    return ulid();
  }
  //
  // FNS -----------------------------------------------------------------------

  //
  // FIELDS --------------------------------------------------------------------

  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  id!: string;

  // name
  @zodField(z.string().openapi({ example: "My Collection" }))
  name!: string;

  // creator_id
  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  creator_id!: string;

  //
  // RELATIONS -----------------------------------------------------------------
  relationCreator() {
    // this.hasOne(Phone, 'foreign_key', 'local_key');
    return this.belongsTo(UserModel, "creator_id", "id");
  }

  // 多对多：一个集合包含多张图片
  relationImages() {
    return this.hasMany(ImageModel, "image_collection_id", "id");
  }
}

//
// SCHEMA + TYPE ---------------------------------------------------------------

export const ImageCollectionSchema = genModelToZodSchema(ImageCollectionModel);

export type IImageCollection = z.infer<typeof ImageCollectionSchema>;
