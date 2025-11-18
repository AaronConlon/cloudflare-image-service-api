import { z } from "@hono/zod-openapi";

export const fmtResSuccess = <T>(params?: {
  data?: T;
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
    data: T;
  };
};

export const formatResponseSchema = (dataSchema?: z.ZodSchema) => {
  return z.object({
    code: z.number().default(0).openapi({
      example: 0,
      description: "Response code, 0 means success",
    }),
    message: z.string().default("ok").openapi({
      example: "ok",
      description: "Response message",
    }),
    data: (dataSchema ?? z.any()).openapi({
      description: "Response data",
    }),
  });
};
