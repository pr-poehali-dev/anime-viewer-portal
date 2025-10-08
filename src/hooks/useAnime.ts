import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api, type Anime } from '@/lib/api';

interface UseAnimeFilters {
  selectedType: string;
  selectedGenre: string;
  selectedYear: string;
  searchQuery: string;
}

export function useAnime() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [newAnime, setNewAnime] = useState({
    title: '',
    description: '',
    type: 'series' as 'series' | 'movie',
    genre: '',
    year: new Date().getFullYear(),
    episodes: 1,
    thumbnail_url: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
  });
  const { toast } = useToast();

  const loadAnime = async (filters: UseAnimeFilters) => {
    try {
      setLoading(true);
      const data = await api.anime.getAll({
        type: filters.selectedType,
        genre: filters.selectedGenre,
        year: filters.selectedYear,
        search: filters.searchQuery,
      });
      setAnimeList(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить аниме',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnime = async () => {
    try {
      await api.anime.create(newAnime);
      toast({ title: 'Успех', description: 'Аниме добавлено!' });
      setNewAnime({
        title: '',
        description: '',
        type: 'series',
        genre: '',
        year: new Date().getFullYear(),
        episodes: 1,
        thumbnail_url: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
      });
      return true;
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const handleDeleteAnime = async (id: number) => {
    try {
      await api.anime.delete(id);
      toast({ title: 'Успех', description: 'Аниме удалено!' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateAnime = async (anime: Anime) => {
    try {
      await api.anime.update(anime);
      toast({ title: 'Успех', description: 'Аниме обновлено!' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const openAnimeDetails = async (anime: Anime) => {
    try {
      const fullAnime = await api.anime.getById(anime.id);
      setSelectedAnime(fullAnime);
      return true;
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const handleUploadVideo = async (file: File): Promise<string> => {
    try {
      const url = await api.upload.file(file);
      toast({ title: 'Успех', description: 'Видео загружено!' });
      return url;
    } catch (error: any) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить видео', variant: 'destructive' });
      throw error;
    }
  };

  const handleUploadThumbnail = async (file: File): Promise<string> => {
    try {
      const url = await api.upload.file(file);
      return url;
    } catch (error: any) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить обложку', variant: 'destructive' });
      throw error;
    }
  };

  return {
    animeList,
    loading,
    selectedAnime,
    newAnime,
    setNewAnime,
    setSelectedAnime,
    loadAnime,
    handleCreateAnime,
    handleDeleteAnime,
    handleUpdateAnime,
    openAnimeDetails,
    handleUploadVideo,
    handleUploadThumbnail,
  };
}
