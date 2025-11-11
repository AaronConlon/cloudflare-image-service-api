## 🧱 一、技术栈与目标

| 模块          | 技术                                       | 功能                                               |
| ------------- | ------------------------------------------ | -------------------------------------------------- |
| Web Framework | **Hono.js**                                | 极简高性能 HTTP 框架                               |
| ORM           | **Sutando ORM**                            | TypeScript 装饰器 ORM（SQLite、D1、Postgres 均可） |
| Schema 验证   | **Zod**                                    | 类型安全与运行时验证                               |
| OpenAPI       | **@hono/openapi**                          | 自动生成 Swagger 文档                              |
| 文件存储      | Cloudflare R2 / Bun FileSystem / S3 兼容层 | 图片上传存储与访问                                 |
| 数据库        | Cloudflare D1 / SQLite / Postgres          | 存储图片元数据                                     |

------

## 🗂 二、项目结构

```bash
src/
├── app.ts                    # Hono 主入口
├── env.ts                    # 环境变量 schema 校验 (Zod)
├── routes/
│   ├── index.ts               # 路由聚合
│   └── upload.route.ts        # 上传接口
├── controllers/
│   └── upload.controller.ts   # 控制器逻辑
├── services/
│   └── upload.service.ts      # 业务层 (存储、DB 操作)
├── models/
│   └── image.model.ts         # Sutando ORM 模型
├── schemas/
│   ├── image.schema.ts        # Zod Schema
│   └── api.response.ts        # 通用响应封装
├── utils/
│   ├── md5.ts                 # 文件 MD5 工具
│   ├── storage.ts             # 文件上传 / CDN URL 工具
│   └── logger.ts              # 统一日志
└── types/
    └── global.d.ts
```