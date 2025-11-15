import { OpenAPIHono } from "@hono/zod-openapi";
import { registerImageRoutes, registerUserRoutes } from "./routes";

const app = new OpenAPIHono<{ Bindings: Env }>();

// register routes
registerImageRoutes(app);
registerUserRoutes(app);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Cloudflare Image Service API",
    version: "0.1.0",
    description: "Early draft of the image upload API surface.",
  },
});

app.get("/", (c) => c.json({ message: "Image Service API ready" }));

export type AppType = typeof app;
export default app;
