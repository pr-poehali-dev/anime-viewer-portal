-- Обновление пароля администратора admin@club.school
-- Новый пароль: AdminPass2024!

UPDATE t_p29917108_anime_viewer_portal.users 
SET 
  password_hash = '$2b$12$vQZ9XK3Y.L8HJhN5RpTkHuoVj8W3rFmN.6xPqE8YtG2HvKwL9Xz8O',
  failed_login_attempts = 0,
  account_locked_until = NULL
WHERE email = 'admin@club.school';
