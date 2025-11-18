import { registerControllers } from "@controllers/index";
import { OpenAPIHono } from "@hono/zod-openapi";
import { isD1Error, isUnauthorizedError } from "@shared/utils/db";
import type { JwtVariables } from "hono/jwt";
import { jwt } from "hono/jwt";

const app = new OpenAPIHono<{ Bindings: Env; Variables: JwtVariables }>();

app.use("*", async (c, next) => {
  // check if the request is a login request
  const whitelistPaths = ["/v1/login", "/v1/register", "/openapi.json"];
  if (whitelistPaths.includes(c.req.path as string)) {
    return next();
  }

  // console request headers
  console.log("request headers:::::", c.req.header());
  // cookie
  console.log("request cookies:::::", c.req.header("Cookie"));
  // jwt secret
  console.log("jwt secret:::::", c.env.JWT_SECRET);

  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET as string,
    cookie: "jwt",
  });

  console.log("jwtMiddleware:::::", jwtMiddleware);

  return jwtMiddleware(c, next);
});

registerControllers(app);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Cloudflare Image Service API",
    version: "0.1.0",
    description: "Early draft of the image upload API surface.",
  },
});

// handle d1 error
app.onError((err, c) => {
  console.log("env:", c.env);

  console.log("error:::::", err);

  // 如果是测试环境，则输出错误信息
  if (c.env.NODE_ENV === "development") {
    if (isD1Error(err)) {
      return c.json(
        { message: (err as any)?.message ?? err ?? "Database error", code: -1 },
        500
      );
    } else if (isUnauthorizedError(err)) {
      return c.json(
        { message: (err as any)?.message ?? err ?? "Unauthorized", code: -1 },
        401
      );
    } else {
      console.log("Other error:::::", err);
    }
  }

  return c.json({ message: "Internal Server Error", code: -1 }, 500);
});

export type AppType = typeof app;
export default app;
