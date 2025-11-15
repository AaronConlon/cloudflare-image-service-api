-- Migration number: 0002 	 2025-11-11T23:44:00.000Z
-- add is_private column
ALTER TABLE images ADD COLUMN is_private INTEGER DEFAULT 0;
-- add file_key column
ALTER TABLE images ADD COLUMN file_key TEXT NOT NULL;
-- add description column
ALTER TABLE images ADD COLUMN description TEXT DEFAULT '';


-- roles
CREATE TABLE roles (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at TEXT DEFAULT NULL
);



-- add user table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  avatar TEXT DEFAULT NULL,

  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at TEXT DEFAULT NULL
);

-- user_role
CREATE TABLE user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,

  -- primary
  PRIMARY KEY (user_id, role_id),

  -- foreign key
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- permissions
CREATE TABLE permissions (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,

  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at TEXT DEFAULT NULL
);

-- role_permission
CREATE TABLE role_permissions (
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,

  -- primary
  PRIMARY KEY (role_id, permission_id),

  -- foreign key
  FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- indexes
CREATE INDEX idx_user_email on users(email);
CREATE INDEX idx_roles_slug on roles(slug);
CREATE INDEX idx_permissions_slug on permissions(slug);
-- 用户和角色关系
CREATE INDEX idx_user_roles_user_id on user_roles(user_id);

-- 给 image 添加 user_id 的外键约束
ALTER TABLE images ADD COLUMN user_id TEXT DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE;