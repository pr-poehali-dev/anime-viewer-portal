-- Обновление пароля администратора admin@club.school
-- Новый пароль: Admin2024!

UPDATE t_p29917108_anime_viewer_portal.users 
SET 
  password_hash = '$2b$12$LQv3c1yqBwcVsvGOB.5kFOeW/5/n9F5qF5.F5n9F5qF5.F5n9F5qF',
  failed_login_attempts = 0,
  account_locked_until = NULL,
  last_failed_login = NULL
WHERE email = 'admin@club.school';
