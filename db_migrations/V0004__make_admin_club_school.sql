-- Делаем admin@club.school администратором
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@club.school';