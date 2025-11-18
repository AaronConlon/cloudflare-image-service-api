import {
  genModelToZodSchema,
  zodField,
} from "@/shared/utils/z-field.decorator";
import { z } from "@hono/zod-openapi";
import { ulid } from "ulid";
import { BaseModel } from "./_base.model";
import { ImageCollectionModel } from "./image-collection.model";
import { UserModel } from "./user.model";

export class ImageModel extends BaseModel {
  // 表名
  table = "images";
  hidden = ["deleted_at"];

  newUniqueId() {
    return ulid();
  }

  // fields
  @zodField(
    z.string().openapi({
      example: "1234567890abcdef",
      description: "The MD5 hash of the image",
    })
  )
  md5!: string;

  @zodField(
    z.string().openapi({
      example: "image.jpg",
      description: "The file name of the image",
    })
  )
  file_name!: string;

  // mime
  @zodField(
    z.string().openapi({
      example: "image/jpeg",
      description: "The MIME type of the image",
    })
  )
  mime!: string;

  // size
  @zodField(
    z.number().openapi({
      example: 100,
      description: "The size of the image in bytes",
    })
  )
  size!: number;

  // width
  @zodField(
    z.number().openapi({
      example: 100,
      description: "The width of the image",
    })
  )
  width!: number;

  // height
  @zodField(
    z.number().openapi({
      example: 100,
      description: "The height of the image",
    })
  )
  height!: number;

  // user_id
  @zodField(
    z.string().openapi({
      example: "1234567890abcdef",
      description: "The ID of the user who uploaded the image",
    })
  )
  user_id!: string;

  // is_private
  @zodField(
    z.number().openapi({
      example: 0,
      description: "Whether the image is private",
    })
  )
  is_private!: number;

  // file_key
  @zodField(
    z.string().openapi({
      example: "1234567890abcdef",
      description: "The key of the image file",
    })
  )
  file_key!: string;

  // description
  @zodField(
    z.string().openapi({
      example: "This is a description of the image",
      description: "The description of the image",
    })
  )
  description!: string;

  // image_collection_id
  @zodField(
    z.string().openapi({
      example: "1234567890abcdef",
      description: "The ID of the collection the image belongs to",
    })
  )
  image_collection_id!: string;

  //
  // RELATIONS -----------------------------------------------------------------
  // 多对一：一张图片属于一个用户
  relationUser() {
    return this.belongsTo(UserModel, "user_id");
  }
  // 一对一：一张图片属于一个集合
  relationCollections() {
    // this.hasOne(Phone, 'foreign_key', 'local_key');
    return this.belongsTo(ImageCollectionModel, "image_collection_id", "id");
  }
}

//
// SCHEMA + TYPE ---------------------------------------------------------------

export const ImageSchema = genModelToZodSchema(ImageModel);

export type IImage = z.infer<typeof ImageSchema>;
