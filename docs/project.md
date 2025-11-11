Cloudflare Image Service API

一个基于 Cloudflare Worker + Images + D1 + Queue 的轻量级图像上传与分发系统。
支持 MD5 去重、异步上传、智能裁剪、自动格式优化 (WebP/AVIF)。

🚀 一、项目目标

提供统一的图像上传 API（支持批量上传）

基于 MD5 去重，节省存储与流量

通过 UUID 映射 MD5，隐藏真实哈希

图片原图存储在 Cloudflare Images

自动根据客户端尺寸与设备格式返回最优图像

支持异步任务处理（通过 Cloudflare Queues）

数据元信息存储在 Cloudflare D1

🧩 二、核心架构
Client
  │
  │  POST /upload
  │  POST /upload-batch
  ▼
[Cloudflare Worker]
  ├── 计算 MD5
  ├── 查重 (D1)
  ├── 推送任务到 Queue
  └── 返回唯一 UUID
      │
      ▼
[Cloudflare Queue]
  └── Worker Consumer (异步执行上传)
         ├── 上传至 Cloudflare Images
         ├── 记录 image_id 至 D1
         └── 通知/状态更新

⚙️ 三、技术栈与组件
组件	功能	说明
Cloudflare Worker (API)	请求入口	提供上传、查询接口
Cloudflare D1	数据库	保存图片映射 {uuid, md5, image_id, meta}
Cloudflare Images	存储与裁剪	原图存储与动态裁剪、格式转换
Cloudflare Queue	异步任务队列	处理批量上传或延时转码
R2 (可选)	冷备份	归档图片或导出备份
KV (可选)	缓存层	加速 UUID↔image_id 映射查询
🧠 四、功能模块设计
1️⃣ 上传接口 /upload

接收单张图片；

计算 MD5；

若数据库存在 → 返回已存在 UUID；

若不存在 → 上传至 Cloudflare Images；

保存 {uuid, md5, image_id} 到 D1；

返回结果：

{ "id": "uuid-xxx", "md5": "abc123...", "existed": false }

2️⃣ 批量上传接口 /upload-batch

接收多个文件；

校验 MD5；

将每个上传任务推入 Queue；

立即返回任务 ID 数组。

3️⃣ 异步任务消费者（Queue Consumer）

从队列拉取任务；

上传至 Cloudflare Images；

更新 D1 状态；

失败时重试（最多 3 次）。

4️⃣ 查询接口 /image

参数：

id 或 md5

可选：w, h, fit=crop|cover

逻辑：

查询 D1 获取 image_id

拼接 URL：

https://imagedelivery.net/<ACCOUNT_HASH>/<image_id>/public?width=400&height=300&fit=crop


返回 JSON：

{ "url": "https://..." }

🗃️ 五、数据库设计（D1 Schema）
CREATE TABLE images (
  id TEXT PRIMARY KEY,            -- UUID
  md5 TEXT UNIQUE NOT NULL,       -- 内容哈希
  image_id TEXT NOT NULL,         -- Cloudflare Images ID
  file_name TEXT,
  mime TEXT,
  width INTEGER,
  height INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_images_md5 ON images(md5);

🧱 六、API 设计概要
Method	Endpoint	功能
POST	/upload	上传单张图片（同步）
POST	/upload-batch	批量上传（异步）
GET	/image?id=...&w=...&h=...	获取裁剪图像 CDN 地址
GET	/check?md5=...	查询图片是否存在
⚡ 七、关键技术点

使用 MD5 去重 → 节省 Cloudflare Images 存储；

UUID 映射层 → 提供短 ID，不暴露哈希；

自动格式优化 → 根据浏览器 Accept 返回 WebP / AVIF；

边缘缓存优化 → 由 Cloudflare CDN 自动分发；

异步处理 → 通过 Queue 处理耗时任务，规避 Worker CPU 限制；

扩展性：

KV 缓存映射关系；

增加权限验证（签名 URL）；

增加统计字段（访问量、引用来源）。

🧮 八、部署结构 (wrangler.toml)
name = "image-api"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "IMAGES_DB"
database_id = "xxxxxx"

[[queues.producers]]
binding = "UPLOAD_QUEUE"
queue = "image-upload-tasks"

[[queues.consumers]]
queue = "image-upload-tasks"
max_batch_size = 10
max_batch_timeout = 5

[vars]
IMAGES_ACCOUNT_ID = "your_account_id"
IMAGES_API_TOKEN = "your_api_token"
IMAGES_DELIVERY_URL = "https://imagedelivery.net/your_account_hash/"

🧩 九、未来扩展
功能	描述
🔒 签名访问	防止外链滥用
📦 R2 归档	备份图片原文件
🔍 搜索接口	按标签/创建者过滤图片
📊 分析功能	热点图片、访问统计
🪶 Web Dashboard	管理图片资源
🧾 十、项目阶段计划
阶段	目标	预计时间
Phase 1	实现 /upload + /image 基础功能	1 天
Phase 2	集成 D1 存储 + MD5 去重	1 天
Phase 3	增加 /upload-batch + Queue 消费者	1–2 天
Phase 4	优化安全与缓存（签名、KV）	1 天
Phase 5	监控、统计、文档完善	1 天
🏁 十一、输出成果

Worker API（TypeScript 模块）

Cloudflare 配置（wrangler.toml）

SQL 初始化脚本（D1）

项目文档（本文件）

可选：前端上传组件示例