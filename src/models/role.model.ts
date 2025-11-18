import {
  genModelToZodSchema,
  zodField,
} from "@/shared/utils/z-field.decorator";
import { z } from "@hono/zod-openapi";
import { ulid } from "ulid";
import { BaseModel } from "./_base.model";
import { UserModel } from "./user.model";

export class RoleModel extends BaseModel {
  table = "roles";
  hidden = ["deleted_at"];

  newUniqueId() {
    return ulid();
  }

  // FIELDS --------------------------------------------------------------------

  @zodField(z.string().openapi({ example: "1234567890abcdef" }))
  id!: string;

  @zodField(z.string().openapi({ example: "Admin" }))
  name!: string;

  @zodField(z.string().openapi({ example: "admin" }))
  slug!: string;

  // RELATIONS -----------------------------------------------------------------
  relationUsers() {
    return this.belongsToMany(UserModel, "user_roles", "user_id", "role_id");
  }

  // relationPermissions() {
  //   return this.belongsToMany(PermissionModel, "role_permissions", "role_id", "permission_id");
  // }
}

// SCHEMA AND TYPE ----------------------------------------------------------------------
export const RoleSchema = genModelToZodSchema(RoleModel);

export type IRole = z.infer<typeof RoleSchema>;
