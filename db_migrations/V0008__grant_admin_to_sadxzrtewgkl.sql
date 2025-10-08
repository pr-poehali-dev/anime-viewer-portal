-- Выдача прав главного администратора пользователю sadxzrtewgkl@gmail.com

UPDATE t_p29917108_anime_viewer_portal.users 
SET 
  role = 'admin',
  is_admin = true
WHERE email = 'sadxzrtewgkl@gmail.com';
