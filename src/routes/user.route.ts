import { UserModel, UserSchema } from "@models/user.model";
import { OmitCommonFields } from "@shared/schemas/common";
import {
  fmtResSuccess,
  formatResponseSchema,
} from "@shared/utils/response-utils";
import { AppType } from "src/app";

export const registerCreateUserRoute = (app: AppType) => {
  app.openapi(
    {
      method: "post",
      path: "/user/create",
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

export const registerUserRoutes = (app: AppType) => {
  registerCreateUserRoute(app);
};
