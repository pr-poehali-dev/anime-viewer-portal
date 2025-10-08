const API_URLS = {
  auth: 'https://functions.poehali.dev/9c6467ba-cbb8-4d50-a49f-a3fc2c0af3b9',
  anime: 'https://functions.poehali.dev/29e057e5-c931-40e5-8321-699b3ebedb4e',
  ratings: 'https://functions.poehali.dev/cf1fa107-8ab3-4d4b-a99a-6cd8a5e5a27c',
  comments: 'https://functions.poehali.dev/0a718001-2c9e-4dba-8644-026735be4aaf',
  changePassword: 'https://functions.poehali.dev/f8ea27dd-7f57-40fc-9e8e-15549e08ead7',
};

export interface Anime {
  id: number;
  title: string;
  description?: string;
  type: 'series' | 'movie';
  genre: string;
  year: number;
  episodes: number;
  rating: number;
  rating_count: number;
  video_url?: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  comment_text: string;
  email: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  is_admin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const getToken = () => localStorage.getItem('auth_token');

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      return data;
    },

    register: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      return data;
    },

    verify: async (): Promise<User> => {
      const token = getToken();
      if (!token) throw new Error('No token');
      
      const response = await fetch(API_URLS.auth, {
        headers: { 'X-Auth-Token': token },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification failed');
      return data.user;
    },
  },

  anime: {
    getAll: async (filters?: {
      type?: string;
      genre?: string;
      year?: string;
      search?: string;
    }): Promise<Anime[]> => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.genre && filters.genre !== 'Все') params.append('genre', filters.genre);
      if (filters?.year && filters.year !== 'Все') params.append('year', filters.year);
      if (filters?.search) params.append('search', filters.search);

      const url = `${API_URLS.anime}${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch anime');
      return data;
    },

    getById: async (id: number): Promise<Anime> => {
      const response = await fetch(`${API_URLS.anime}?id=${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch anime');
      return data;
    },

    create: async (anime: Partial<Anime>): Promise<Anime> => {
      const token = getToken();
      const response = await fetch(API_URLS.anime, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify(anime),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create anime');
      return data;
    },

    update: async (anime: Partial<Anime> & { id: number }): Promise<Anime> => {
      const token = getToken();
      const response = await fetch(API_URLS.anime, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify(anime),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update anime');
      return data;
    },

    delete: async (id: number): Promise<void> => {
      const token = getToken();
      const response = await fetch(`${API_URLS.anime}?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token || '' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete anime');
    },
  },

  comments: {
    getByAnimeId: async (animeId: number): Promise<Comment[]> => {
      const response = await fetch(`${API_URLS.comments}?anime_id=${animeId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch comments');
      return data;
    },

    create: async (animeId: number, commentText: string): Promise<Comment> => {
      const token = getToken();
      const response = await fetch(API_URLS.comments, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify({ anime_id: animeId, comment_text: commentText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create comment');
      return data;
    },
  },

  ratings: {
    rate: async (animeId: number, rating: number): Promise<{ rating: number; rating_count: number }> => {
      const token = getToken();
      const response = await fetch(API_URLS.ratings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || '',
        },
        body: JSON.stringify({ anime_id: animeId, rating }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to rate anime');
      return data;
    },
  },

  password: {
    change: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
      const token = getToken();
      if (!token) throw new Error('Требуется авторизация');
      
      const response = await fetch(API_URLS.changePassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Не удалось изменить пароль');
      return data;
    },
  },
};