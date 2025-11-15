import { z } from "@hono/zod-openapi";

export const CommonModelSchema = z.object({
  id: z.string().openapi({
    example: "1234567890abcdef",
    description: "The ID of the model",
  }),
  created_at: z.string().openapi({
    example: "2025-01-01T00:00:00.000Z",
    description: "The creation time of the model",
  }),
  updated_at: z.string().openapi({
    example: "2025-01-01T00:00:00.000Z",
    description: "The update time of the model",
  }),
  deleted_at: z.string().openapi({
    example: "2025-01-01T00:00:00.000Z",
    description: "The deletion time of the model",
  }),
});

export const OmitCommonFields = {
  created_at: true,
  updated_at: true,
  deleted_at: true,
  id: true,
} as const;

export const CommonFileSchema = z.object({
  file: z.any().openapi({
    type: "string",
    format: "binary",
    example: "data:application/octet-stream;base64,...",
    description: "待上传的二进制文件",
  }),
});

