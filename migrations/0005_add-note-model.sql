-- Migration number: 0005 	 2025-11-18T11:43:49.208Z

-- add content tables
CREATE TABLE contents (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at TEXT DEFAULT NULL
);


-- add comments
CREATE TABLE article_comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  -- article id
  article_id TEXT NOT NULL,
  parent_comment_id TEXT DEFAULT NULL,
  author_id TEXT NOT NULL,


  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),

  -- foreign key
  FOREIGN KEY (article_id) REFERENCES articles(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- add note table
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
  -- content id
  content_id TEXT NOT NULL UNIQUE,

  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at TEXT DEFAULT NULL,

  -- foreign key
  FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES contents(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 按作者查询文章
CREATE INDEX idx_articles_author_id ON articles(author_id);

-- 按状态查询文章
CREATE INDEX idx_articles_status ON articles(status);

-- 按创建时间查询文章
CREATE INDEX idx_articles_created_at ON articles(created_at);

-- 前台最常见的查询：已发布 + 按时间倒序分页（必备！）
CREATE INDEX idx_articles_published ON articles(status, published_at DESC, id DESC);

-- 评论索引 - 基于文章 id 和创建时间倒序
CREATE INDEX idx_article_comments_article_id ON article_comments(article_id, created_at DESC);

