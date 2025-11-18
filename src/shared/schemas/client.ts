import { z } from "@hono/zod-openapi";

// 注册 schema
export const ClientRegisterRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    name: z.string().min(1).max(255),
    verification_code: z.string().optional(),
  })
  .openapi({
    example: {
      email: "test@example.com",
      password: "password",
      name: "John Doe",
      verification_code: "123456",
    },
    description: "Client register request",
  });

// 登录
export const ClientLoginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    verification_code: z.string(),
  })
  .openapi({
    example: {
      email: "test@example.com",
      password: "password",
      verification_code: "123456",
    },
    description: "Client login request",
  });
