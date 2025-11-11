import { z } from "@hono/zod-openapi";
import { CommonModelSchema } from "./common";

/**
 * 图片 schema 就是数据库的 schema
 */
export const BasicImageSchema = z.object({
  md5: z.string().openapi({
    example: "1234567890abcdef",
    description: "The MD5 hash of the image",
  }),
  file_name: z.string().openapi({
    example: "image.jpg",
    description: "The file name of the image",
  }),
  mime: z.string().openapi({
    example: "image/jpeg",
    description: "The MIME type of the image",
  }),
  size: z.number().openapi({
    example: 100,
    description: "The size of the image in bytes",
  }),
  width: z.number().openapi({
    example: 100,
    description: "The width of the image",
  }),
  height: z.number().openapi({
    example: 100,
    description: "The height of the image",
  }),
});

export const ImageSchema = BasicImageSchema.extend(CommonModelSchema.shape);

export type TBasicImageSchemaType = z.infer<typeof BasicImageSchema>;
export type TImageSchemaType = z.infer<typeof ImageSchema>;
