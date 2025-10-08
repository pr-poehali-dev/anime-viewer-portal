ALTER TABLE t_p29917108_anime_viewer_portal.security_logs
ADD COLUMN IF NOT EXISTS id SERIAL PRIMARY KEY,
ADD COLUMN IF NOT EXISTS user_id INT,
ADD COLUMN IF NOT EXISTS action VARCHAR(255),
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS success BOOLEAN,
ADD COLUMN IF NOT EXISTS details TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_security_logs_user ON t_p29917108_anime_viewer_portal.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_created ON t_p29917108_anime_viewer_portal.security_logs(created_at);