import { z } from "@hono/zod-openapi";
import { genModelToZodSchema, zodField } from "@utils/z-field.decorator";
import { ulid } from "ulid";
import { BaseModel } from "./_base.model";
import { ImageCollectionModel } from "./image-collection.model";
import { ImageModel } from "./image.model";

export class UserModel extends BaseModel {
  table = "users";

  newUniqueId() {
    return ulid();
  }
  //
  // FNS -----------------------------------------------------------------------

  //
  // FIELDS --------------------------------------------------------------------

  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  id!: string;

  @zodField(
    z
      .string()
      .openapi({ example: "John Doe", description: "The name of the user" })
  )
  name!: string;

  @zodField(z.string().optional().openapi({ example: "john@example.com" }))
  email!: string;

  @zodField(z.string().openapi({ example: "uJszmNoQULxahGGZ" }))
  password!: string;

  @zodField(
    z.string().optional().openapi({ example: "https://example.com/avatar.jpg" })
  )
  avatar!: string;

  //
  // RELATIONS -----------------------------------------------------------------
  relationCollections() {
    // this.hasOne(Phone, 'foreign_key', 'local_key');
    return this.hasMany(ImageCollectionModel, "creator_id", "id");
  }

  relationImages() {
    return this.hasMany(ImageModel, "user_id", "id");
  }
}

//
// SCHEMA + TYPE ---------------------------------------------------------------

export const UserSchema = genModelToZodSchema(UserModel);

export type IUser = z.infer<typeof UserSchema>;
