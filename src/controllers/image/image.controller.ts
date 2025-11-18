import { AppType } from "@/app";
import { ImageSchema } from "@models/image.model";
import { CommonModelSchema } from "@shared/schemas/common";

const registerUploadRoute = (app: AppType) => {
  app.openapi(
    {
      method: "post",
      path: "/upload",
      request: {
        body: {
          content: {
            "multipart/form-data": {
              schema: ImageSchema.extend(CommonModelSchema.shape),
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
              schema: CommonModelSchema.pick({ id: true }),
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
