import { z } from "@hono/zod-openapi";

export const fmtResSuccess = <T>(params?: {
  data?: T | null;
  code?: number;
  message?: string;
}) => {
  return Object.assign(
    {
      code: 0,
      message: "ok",
      data: null,
    },
    params
  ) as {
    code: number;
    message: string;
    data: T | null;
  };
};

export const formatResponseSchema = (dataSchema?: z.ZodSchema) => {
  return z.object({
    data: z
      .object({
        data: dataSchema ?? z.any(),
        code: z.number().default(0),
        message: z.string().default("ok"),
      })
      .openapi({
        description: "Response data",
        // 不提供 data 字段的示例，让 OpenAPI 生成器从 schema 定义中自动提取
        // 这样可以避免解析空对象导致的 ZodError
        example: {
          code: 0,
          message: "ok",
        },
      }),
  });
};
