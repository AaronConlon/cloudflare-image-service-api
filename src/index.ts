import { fmtDbQueryData } from "@shared/utils/db";
import ClientD1 from "knex-cloudflare-d1";
import { sutando } from "sutando";
import app from "./app";

export default {
  fetch: (req: Request, env: Env) => {
    // 首先连接 sutando db
    sutando.addConnection({
      client: ClientD1,
      connection: {
        database: env.DB,
      },
      useNullAsDefault: true,
    });
    // 检查是否是开发环境
    if (env.NODE_ENV === "development") {
      // 获取 db，设置监听
      const db = sutando.connection();
      //  @ts-ignore
      db.on("query", (queryData: any) => {
        fmtDbQueryData({
          method: queryData.method,
          sqlStr: queryData.sql,
          bindings: queryData.bindings,
          language: "sqlite",
        });
      });

      // debug info
      console.log("db connected.");
    }

    return app.fetch(req, env);
  },
};
