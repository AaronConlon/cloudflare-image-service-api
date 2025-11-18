import { registerControllers } from "@controllers/index";
import { OpenAPIHono } from "@hono/zod-openapi";
import { isD1Error } from "@shared/utils/db";

const app = new OpenAPIHono<{ Bindings: Env }>();

registerControllers(app);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Cloudflare Image Service API",
    version: "0.1.0",
    description: "Early draft of the image upload API surface.",
  },
});

app.get("/", (c) => c.json({ message: "Image Service API ready" }));

// handle d1 error
app.onError((err, c) => {
  console.log("env:", c.env);

  // 如果是测试环境，则输出错误信息
  if (c.env.NODE_ENV === "development") {
    console.error("error:::::", err);
    if (isD1Error(err)) {
      return c.json(
        { message: (err as any)?.message ?? err ?? "Database error", code: -1 },
        500
      );
    } else {
      console.log("not d1 error:::::", err);
    }
  }

  return c.json({ message: "Internal Server Error", code: -1 }, 500);
});

export type AppType = typeof app;
export default app;
