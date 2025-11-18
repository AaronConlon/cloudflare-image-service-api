import { AppType } from "@/app";
import { PermissionModel, PermissionSchema } from "@models/permission.model";
import {
  CommonIdSchema,
  CommonPaginationRequestSchema,
  genPaginationResponseSchema,
  OmitCommonFields,
} from "@shared/schemas/common";
import {
  fmtResSuccess,
  formatResponseSchema,
} from "@shared/utils/response-utils";

// GET 🟢 /permissions
export const v1_route__GET_permissions = (app: AppType) => {
  app.openapi(
    {
      method: "get",
      path: "/v1/permissions",
      tags: ["Permission"],
      description: "Get permissions list by pagination",
      request: {
        query: CommonPaginationRequestSchema,
      },
      responses: {
        200: {
          description: "Permissions fetched successfully",
          content: {
            "application/json": {
              schema: genPaginationResponseSchema(PermissionSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { page, page_size } = await c.req.valid("query");
      const permissions = await PermissionModel.query().paginate(
        page,
        page_size
      );
      return c.json(fmtResSuccess({ data: permissions.toJSON() }));
    }
  );
};

// POST 🟡 /permission/create
export const v1_route__POST_permissionCreate = (app: AppType) => {
  app.openapi(
    {
      method: "post",
      path: "/v1/permission/create",
      tags: ["Permission"],
      description: "Create a new permission",
      request: {
        body: {
          content: {
            "application/json": {
              schema: PermissionSchema.omit(OmitCommonFields),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Permission created successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(PermissionSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const permissionData = await c.req.valid("json");
      const permission = await PermissionModel.query().create(permissionData);
      return c.json(fmtResSuccess({ data: permission }));
    }
  );
};

// PUT 🟡 /permission/update/{id}
export const v1_route__PUT_permissionUpdate = (app: AppType) => {
  app.openapi(
    {
      method: "put",
      path: "/v1/permission/update/{id}",
      tags: ["Permission"],
      description: "Update a permission by id",
      request: {
        params: CommonIdSchema,
        body: {
          content: {
            "application/json": {
              schema: PermissionSchema.omit(OmitCommonFields),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Permission updated successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(PermissionSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { id } = await c.req.valid("param");
      const permissionData = await c.req.valid("json");
      const permission = await PermissionModel.query().where("id", id).first();
      if (!permission) {
        return c.json(
          fmtResSuccess({ code: -1, message: "Permission not found" })
        );
      }
      await permission.update(permissionData);
      return c.json(fmtResSuccess({ data: permission }));
    }
  );
};

// DELETE 🔴 /permission/delete/{id}
export const v1_route__DELETE_permissionDelete = (app: AppType) => {
  app.openapi(
    {
      method: "delete",
      path: "/v1/permission/delete/{id}",
      tags: ["Permission"],
      description: "Delete a permission by id",
      request: {
        params: CommonIdSchema,
      },
      responses: {
        200: {
          description: "Permission deleted successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(PermissionSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { id } = await c.req.valid("param");
      const permission = await PermissionModel.query().where("id", id).first();
      if (!permission) {
        return c.json(
          fmtResSuccess({ code: -1, message: "Permission not found" })
        );
      }
      await permission.delete();
      return c.json(fmtResSuccess({ data: permission }));
    }
  );
};

// GET 🟢 /permission/{id}
export const v1_route__GET_permission = (app: AppType) => {
  app.openapi(
    {
      method: "get",
      path: "/v1/permission/{id}",
      tags: ["Permission"],
      description: "Get a permission by id",
      request: {
        params: CommonIdSchema,
      },
      responses: {
        200: {
          description: "Permission fetched successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(PermissionSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { id } = await c.req.valid("param");
      const permission = await PermissionModel.query().where("id", id).first();
      if (!permission) {
        return c.json(
          fmtResSuccess({ code: -1, message: "Permission not found" })
        );
      }
      return c.json(fmtResSuccess({ data: permission }));
    }
  );
};

export const registerPermissionRoutes = (app: AppType) => {
  v1_route__POST_permissionCreate(app);
  v1_route__PUT_permissionUpdate(app);
  v1_route__DELETE_permissionDelete(app);
  v1_route__GET_permissions(app);
  v1_route__GET_permission(app);
};
