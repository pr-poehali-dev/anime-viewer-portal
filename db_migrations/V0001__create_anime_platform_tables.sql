CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anime (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('series', 'movie')),
    genre VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    episodes INTEGER DEFAULT 1,
    rating DECIMAL(3,1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    video_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    anime_id INTEGER NOT NULL REFERENCES anime(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    anime_id INTEGER NOT NULL REFERENCES anime(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(anime_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_anime_type ON anime(type);
CREATE INDEX IF NOT EXISTS idx_anime_genre ON anime(genre);
CREATE INDEX IF NOT EXISTS idx_anime_year ON anime(year);
CREATE INDEX IF NOT EXISTS idx_comments_anime ON comments(anime_id);
CREATE INDEX IF NOT EXISTS idx_ratings_anime ON ratings(anime_id);

INSERT INTO users (email, password_hash, is_admin) VALUES 
('admin@dock.anime', '$2b$10$rZJ7YzXM5Q5LHhGl0z0xqOXxJxN.Vf3fN8YHn8xH7xH7xH7xH7xH7', true);

INSERT INTO anime (title, description, type, genre, year, episodes, rating, rating_count, thumbnail_url) VALUES
('Космический пират Харлок', 'Эпическая история о бесстрашном пирате в космосе', 'series', 'Приключения', 2024, 24, 9.2, 1250, 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png'),
('Последний самурай', 'История последнего воина в современном мире', 'movie', 'Экшен', 2024, 1, 8.8, 980, 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png'),
('Хроники магии', 'Приключения юного мага в мире фэнтези', 'series', 'Фэнтези', 2023, 12, 9.5, 1890, 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png'),
('Город будущего', 'Киберпанк история о мире будущего', 'movie', 'Фантастика', 2023, 1, 8.3, 670, 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png'),
('Академия героев', 'Школа супергероев готовит защитников', 'series', 'Экшен', 2024, 24, 9.0, 1450, 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png'),
('Тайна древних', 'Археологические приключения в поисках артефактов', 'series', 'Приключения', 2022, 13, 8.7, 890, 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png');