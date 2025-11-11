-- Migration number: 0001 	 2025-11-11T21:49:07.287Z

CREATE TABLE images (
  id TEXT PRIMARY KEY,
  md5 TEXT UNIQUE NOT NULL,
  file_name TEXT,
  mime TEXT,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at TEXT DEFAULT NULL
);

CREATE INDEX idx_images_md5 ON images(md5);
CREATE INDEX idx_images_deleted_at ON images(deleted_at);