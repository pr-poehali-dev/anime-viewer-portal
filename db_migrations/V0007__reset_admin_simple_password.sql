-- Сброс пароля администратора admin@club.school
-- Используем правильный bcrypt хеш для пароля: Test1234!

UPDATE t_p29917108_anime_viewer_portal.users 
SET 
  password_hash = '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
  failed_login_attempts = 0,
  account_locked_until = NULL,
  last_failed_login = NULL
WHERE email = 'admin@club.school';
