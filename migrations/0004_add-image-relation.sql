-- Migration number: 0004 	 2025-11-15T12:49:18.831Z
-- 给 Collection 添加 image_id 外键约束
ALTER TABLE images
  ADD COLUMN image_collection_id TEXT DEFAULT NULL REFERENCES image_collections(id) ON DELETE CASCADE;
