import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  PORT: z.coerce.number().default(8787),
  DB: z.any(),
  BASE_URL: z.string().url().optional(),
  IMAGES_DELIVERY_URL: z.string().url().optional(),
});

export type TAppEnv = z.infer<typeof EnvSchema>;
