-- Migration number: 0003 	 2025-11-15T08:45:07.160Z
-- add image collection table
CREATE TABLE image_collections (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  
  -- creator
  creator_id TEXT NOT NULL,
  -- 集合名称在创建者下唯一
  UNIQUE (creator_id, name),
  -- 同步删除
  FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 中间表
CREATE TABLE image_collection_members (
  image_collection_id TEXT NOT NULL,
  user_id TEXT NOT NULL,

  -- primary
  PRIMARY KEY (image_collection_id, user_id),

  -- 同步删除
  FOREIGN KEY (image_collection_id) REFERENCES image_collections(id) ON UPDATE CASCADE ON DELETE CASCADE,
  -- 同步删除
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- indexes
CREATE INDEX idx_image_collections_creator_id on image_collections (creator_id);

-- 查询一个集合的所有成员
CREATE INDEX idx_ic_members_collection_id ON image_collection_members(image_collection_id);

-- 查询一个用户加入的所有集合
CREATE INDEX idx_ic_members_user_id ON image_collection_members(user_id);

