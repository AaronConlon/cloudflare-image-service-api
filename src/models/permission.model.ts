import { z } from "@hono/zod-openapi";
import { genModelToZodSchema, zodField } from "@utils/z-field.decorator";
import { ulid } from "ulid";
import { BaseModel } from "./_base.model";
import { RoleModel } from "./role.model";

export class PermissionModel extends BaseModel {
  table = "permissions";

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
  relationRoles() {
    return this.belongsToMany(
      RoleModel,
      "role_permissions",
      "permission_id",
      "role_id"
    );
  }
}

// SCHEMA AND TYPE ----------------------------------------------------------------------
export const PermissionSchema = genModelToZodSchema(PermissionModel);

export type IPermission = z.infer<typeof PermissionSchema>;
