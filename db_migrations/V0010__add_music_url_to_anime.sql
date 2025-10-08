-- Добавление поля music_url в таблицу anime

ALTER TABLE t_p29917108_anime_viewer_portal.anime 
ADD COLUMN IF NOT EXISTS music_url TEXT;
