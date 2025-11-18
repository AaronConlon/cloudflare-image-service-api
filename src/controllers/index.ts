import { AppType } from "src/app";
import { registerImageRoutes } from "./image/image.controller";
import { registerRoleRoutes } from "./role/role.controller";
import { registerUserRoutes } from "./user/user.controller";

export const registerControllers = (app: AppType) => {
  registerImageRoutes(app);
  registerUserRoutes(app);
  registerRoleRoutes(app);
};
