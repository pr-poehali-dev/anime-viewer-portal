ALTER TABLE t_p29917108_anime_viewer_portal.users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE t_p29917108_anime_viewer_portal.users SET role = 'admin' WHERE is_admin = true;
UPDATE t_p29917108_anime_viewer_portal.users SET role = 'user' WHERE is_admin = false OR is_admin IS NULL;