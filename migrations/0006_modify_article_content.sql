-- Migration number: 0006 	 2025-11-19T02:37:34.024Z

-- 重建 article 表
DROP TABLE articles;
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  cover_image TEXT DEFAULT NULL,

  -- status (approved, pending, rejected, draft)
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  published_at TEXT DEFAULT NULL,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  -- author
  author_id TEXT NOT NULL,

  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at TEXT DEFAULT NULL,

  -- foreign key
  -- 作者
  FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);


-- 删除 content 表，重建为 article_contents 表
DROP TABLE contents;
CREATE TABLE article_contents (
  article_id TEXT NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (article_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 若干索引

-- 作者文章列表
CREATE INDEX idx_articles_author_id ON articles(author_id);

-- 状态过滤（后台审核 / 前台 published）
CREATE INDEX idx_articles_status ON articles(status);

-- 后台按创建时间倒序
CREATE INDEX idx_articles_created_at ON articles(created_at);

-- 前台首页：已发布文章倒序分页（最强索引）
CREATE INDEX idx_articles_published ON articles(
  status, 
  published_at DESC,
  id DESC
);
