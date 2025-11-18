import { AppType } from "@/app";
import { registerImageRoutes } from "./image/image.controller";
import { registerPermissionRoutes } from "./permission/permission.controller";
import { registerRoleRoutes } from "./role/role.controller";
import { registerClientRoutes } from "./user/client.controller";
import { registerUserRoutes } from "./user/user.controller";

export const registerControllers = (app: AppType) => {
  registerImageRoutes(app);
  registerUserRoutes(app);
  registerRoleRoutes(app);
  registerPermissionRoutes(app);
  registerClientRoutes(app);
};
