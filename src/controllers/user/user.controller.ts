import { UserModel, UserSchema } from "@models/user.model";
import {
  CommonIdSchema,
  CommonPaginationRequestSchema,
  CommonSuccessSchema,
  genPaginationResponseSchema,
  OmitCommonFields,
} from "@shared/schemas/common";
import {
  fmtResSuccess,
  formatResponseSchema,
} from "@shared/utils/response-utils";
import { AppType } from "src/app";

// GET 🟢 /users
export const v1_route__GET_users = (app: AppType) => {
  app.openapi(
    {
      method: "get",
      path: "/v1/users",
      tags: ["User"],
      description: "Get users list by pagination",
      request: {
        query: CommonPaginationRequestSchema,
      },
      responses: {
        200: {
          description: "Users fetched successfully",
          content: {
            "application/json": {
              schema: genPaginationResponseSchema(UserSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { page, page_size } = await c.req.valid("query");
      const users = await UserModel.query().paginate(page, page_size);
      return c.json(
        fmtResSuccess({
          data: users.toJSON(),
        })
      );
    }
  );
};

// POST 🟡 /user/create
export const v1_route__POST_userCreate = (app: AppType) => {
  app.openapi(
    {
      method: "post",
      path: "/v1/user/create",
      tags: ["User"],
      description: "Create a new user",
      request: {
        body: {
          content: {
            "application/json": {
              schema: UserSchema.omit(OmitCommonFields),
            },
          },
        },
      },
      responses: {
        200: {
          description: "User created",
          content: {
            "application/json": {
              schema: formatResponseSchema(UserSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const userData = await c.req.valid("json");
      // check if user already exists, if not, create user
      const user = await UserModel.query()
        .where("email", userData.email)
        .first();

      if (user) {
        return c.json(
          fmtResSuccess({
            code: -1,
            message: "User already exists",
          }),
          200
        );
      }

      const newUser = await UserModel.query().create(userData);
      return c.json(
        fmtResSuccess({
          data: newUser,
        })
      );
    }
  );
};

// GET 🟢 /user/{id}
export const v1_route__GET_user = (app: AppType) => {
  app.openapi(
    {
      method: "get",
      path: "/v1/user/{id}",
      tags: ["User"],
      description: "Get a user by id",
      request: {
        params: CommonIdSchema,
      },
      responses: {
        200: {
          description: "User fetched successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(UserSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { id } = await c.req.valid("param");
      const user = await UserModel.query().where("id", id).first();
      return c.json(
        fmtResSuccess({
          data: user,
        })
      );
    }
  );
};

// PUT 🟡 /user/update/{id}
export const v1_route__PUT_userUpdate = (app: AppType) => {
  app.openapi(
    {
      method: "put",
      path: "/v1/user/update/{id}",
      tags: ["User"],
      description: "Update a user by id",
      request: {
        params: CommonIdSchema,
        body: {
          content: {
            "application/json": {
              schema: UserSchema.omit(OmitCommonFields),
            },
          },
        },
      },
      responses: {
        200: {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(CommonSuccessSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { id } = await c.req.valid("param");
      const userData = await c.req.valid("json");
      const user = await UserModel.query().where("id", id).first();

      if (!user) {
        return c.json(
          fmtResSuccess({
            data: { success: false },
            code: -1,
            message: "User not found",
          })
        );
      }

      await user.update(userData);
      return c.json(
        fmtResSuccess({
          data: { success: true },
          code: 0,
          message: "User updated successfully",
        })
      );
    }
  );
};

// DELETE 🟡 /user/delete/{id}
export const v1_route__DELETE_userDelete = (app: AppType) => {
  app.openapi(
    {
      method: "delete",
      path: "/v1/user/delete/{id}",
      tags: ["User"],
      description: "Delete a user by id",
      request: {
        params: CommonIdSchema,
      },
      responses: {
        200: {
          description: "User deleted successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(CommonSuccessSchema),
            },
          },
        },
      },
    },
    async (c) => {
      const { id } = await c.req.valid("param");
      const user = await UserModel.query().where("id", id).first();
      if (!user) {
        return c.json(
          fmtResSuccess({
            data: { success: false },
            code: -1,
            message: "User not found",
          })
        );
      }
      await user.delete();
      return c.json(
        fmtResSuccess({
          data: { success: true },
          code: 0,
          message: "User deleted successfully",
        })
      );
    }
  );
};

export const registerUserRoutes = (app: AppType) => {
  v1_route__POST_userCreate(app);
  v1_route__PUT_userUpdate(app);
  v1_route__GET_user(app);
  v1_route__GET_users(app);
  v1_route__DELETE_userDelete(app);
};
