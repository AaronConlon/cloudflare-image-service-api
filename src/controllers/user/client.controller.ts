import { AppType } from "@/app";
import { UserModel, UserSchema } from "@/models/user.model";
import {
  ClientLoginRequestSchema,
  ClientRegisterRequestSchema,
} from "@/shared/schemas/client";
import { comparePassword, hashPassword } from "@/shared/utils/hash";
import {
  fmtResSuccess,
  formatResponseSchema,
} from "@/shared/utils/response-utils";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { omit } from "lodash-es";

// POST 🟡 /client/login
const v1_route__POST_login = (app: AppType) => {
  app.openapi(
    {
      method: "post",
      path: "/v1/login",
      tags: ["Client"],
      description: "Login a client",
      request: {
        body: {
          content: {
            "application/json": {
              schema: ClientLoginRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Client logged in successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(
                UserSchema.omit({ password: true, deleted_at: true })
              ),
            },
          },
        },
      },
    },
    async (c) => {
      const clientData = await c.req.valid("json");
      const user = await UserModel.query()
        .where("email", clientData.email)
        .first();
      if (!user) {
        return c.json(
          fmtResSuccess({
            code: -1,
            message: "User email or password is incorrect",
          })
        );
      }
      if (!(await comparePassword(clientData.password, user.password))) {
        return c.json(
          fmtResSuccess({
            code: -1,
            message: "User email or password is incorrect",
          })
        );
      }

      //Generate jwt
      const token = await sign(
        {
          userId: user.id,
          // number of seconds from now to 30 days
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 1000,
        },
        c.env.JWT_SECRET as string
      );
      // 签名
      // Signed cookies
      await setCookie(
        c,
        "jwt", // cookie name
        token,
        {
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "Strict",
          expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days
        }
      );

      return c.json(
        fmtResSuccess({
          data: omit(user.toJSON(), ["password", "deleted_at"]),
        })
      );
    }
  );
};

// POST 🟡 /client/register
const v1_route__POST_register = (app: AppType) => {
  app.openapi(
    {
      method: "post",
      path: "/v1/register",
      tags: ["Client"],
      description: "Register a client",
      request: {
        body: {
          content: {
            "application/json": {
              schema: ClientRegisterRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Client registered successfully",
          content: {
            "application/json": {
              schema: formatResponseSchema(
                UserSchema.omit({ password: true, deleted_at: true })
              ),
            },
          },
        },
      },
    },
    async (c) => {
      const clientData = await c.req.valid("json");

      // check if user already exists, if not, create user
      const record = await UserModel.query()
        .where("email", clientData.email)
        .first();
      if (record) {
        return c.json(
          fmtResSuccess({
            code: -1,
            message:
              "Email already exists, please use another email to register",
          }),
          200
        );
      }

      // hash password
      const hashedPassword = await hashPassword(clientData.password);

      const user = await UserModel.query().create({
        ...omit(clientData, ["verification_code"]),
        password: hashedPassword,
      });

      const data = user.toJSON();

      const token = await sign(
        {
          userId: user.id,
        },
        c.env.JWT_SECRET as string
      );

      // 签名
      // Signed cookies
      await setCookie(
        c,
        "jwt", // cookie name
        token,
        {
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "Strict",
          expires: new Date(Date.now() + 60 * 60 * 24 * 30), // 30 days
        }
      );

      return c.json(
        fmtResSuccess({ data: omit(data, ["password", "deleted_at"]) })
      );
    }
  );
};

export const registerClientRoutes = (app: AppType) => {
  v1_route__POST_login(app);
  v1_route__POST_register(app);
};
