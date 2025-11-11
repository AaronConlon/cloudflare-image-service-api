export type TAppBindings = CloudflareBindings & {
  DB: D1Database;
  BASE_URL?: string;
  NODE_ENV: string;
};
