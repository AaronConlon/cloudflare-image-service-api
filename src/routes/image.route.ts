import {
  BasicImageSchema,
  CommonFileSchema,
  ImageSchema,
} from "@shared/schemas";
import { AppType } from "src/app";

const registerUploadRoute = (app: AppType) => {
  app.openapi(
    {
      method: "post",
      path: "/upload",
      request: {
        body: {
          content: {
            "multipart/form-data": {
              schema: BasicImageSchema.extend(CommonFileSchema.shape),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Image already existed",
          content: {
            "application/json": {
              // just pick id
              schema: ImageSchema.pick({ id: true }),
            },
          },
        },
      },
    },
    async (c) => {
      return c.json(
        {
          id: "1234567890abcdef",
        },
        200
      );
    }
  );
};

export const registerImageRoutes = (app: AppType) => {
  registerUploadRoute(app);
};
