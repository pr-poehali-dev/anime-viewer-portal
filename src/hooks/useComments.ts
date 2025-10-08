import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api, type Anime } from '@/lib/api';

export function useComments() {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleAddComment = async (selectedAnime: Anime | null, onUpdate: (anime: Anime) => void) => {
    if (!selectedAnime || !newComment.trim()) return;
    
    try {
      await api.comments.create(selectedAnime.id, newComment);
      toast({ title: 'Комментарий добавлен' });
      setNewComment('');
      const updatedAnime = await api.anime.getById(selectedAnime.id);
      onUpdate(updatedAnime);
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleRate = async (selectedAnime: Anime | null, rating: number, onUpdate: (anime: Anime) => void, onReload?: () => void) => {
    if (!selectedAnime) return;
    
    try {
      await api.ratings.rate(selectedAnime.id, rating);
      toast({ title: 'Оценка сохранена', description: `Вы поставили ${rating}/10` });
      const updatedAnime = await api.anime.getById(selectedAnime.id);
      onUpdate(updatedAnime);
      if (onReload) onReload();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  return {
    newComment,
    setNewComment,
    handleAddComment,
    handleRate,
  };
}
