import { AppType } from "@/app";
import { RoleModel, RoleSchema } from "@models/role.model";
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

// GET 🟢 /roles
const v1_route__GET_roles = (app: AppType) => {
  app.openapi(
    {
      method: "get",
      path: "/v1/roles",
      tags: ["Role"],
      description: "Get roles list by pagination",
      request: {
        query: CommonPaginationRequestSchema,
      },
      responses: {
        200: {
          description: "Roles fetched successfully",
          content: {
            "application/json": {
              schema: genPaginationResponseSchema(RoleSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { page, page_size } = await c.req.valid("query");
      const roles = await RoleModel.query().paginate(page, page_size);
      return c.json(
        fmtResSuccess({
          data: roles.toJSON(),
        })
      );
    }
  );
};

// POST 🟡 /role/create
const v1_route__POST_roleCreate = (app: AppType) => {
  app.openapi(
    {
      method: "post",
      path: "/v1/role/create",
      tags: ["Role"],
      description: "Create a new role",
      request: {
        body: {
          content: {
            "application/json": {
              schema: RoleSchema.omit(OmitCommonFields),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Role created successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(RoleSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const roleData = await c.req.valid("json");
      const role = await RoleModel.query().create(roleData);
      return c.json(
        fmtResSuccess({
          data: role,
        }),
        200
      );
    }
  );
};

// DELETE 🔴 /role/delete/{id}
const v1_route__DELETE_roleDelete = (app: AppType) => {
  app.openapi(
    {
      method: "delete",
      path: "/v1/role/delete/{id}",
      tags: ["Role"],
      description: "Delete a role by id",
      request: {
        params: CommonIdSchema,
      },
      responses: {
        200: {
          description: "Role deleted successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(RoleSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { id } = await c.req.valid("param");
      const role = await RoleModel.query().where("id", id).first();
      if (!role) {
        return c.json(fmtResSuccess({ code: -1, message: "Role not found" }));
      }
      await role.delete();
      return c.json(fmtResSuccess({ data: role }));
    }
  );
};

// PUT 🟡 /role/update/{id}
const v1_route__PUT_roleUpdate = (app: AppType) => {
  app.openapi(
    {
      method: "put",
      path: "/v1/role/update/{id}",
      tags: ["Role"],
      description: "Update a role by id",
      request: {
        params: CommonIdSchema,
        body: {
          content: {
            "application/json": {
              schema: RoleSchema.omit(OmitCommonFields),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Role updated successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(RoleSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { id } = await c.req.valid("param");
      const roleData = await c.req.valid("json");
      const role = await RoleModel.query().where("id", id).first();
      if (!role) {
        return c.json(fmtResSuccess({ code: -1, message: "Role not found" }));
      }
      await role.update(roleData);
      return c.json(fmtResSuccess({ data: role }));
    }
  );
};

export const registerRoleRoutes = (app: AppType) => {
  v1_route__GET_roles(app);
  v1_route__POST_roleCreate(app);
  v1_route__DELETE_roleDelete(app);
  v1_route__PUT_roleUpdate(app);
};
