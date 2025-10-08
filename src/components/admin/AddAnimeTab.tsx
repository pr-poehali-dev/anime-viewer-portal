import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AddAnimeTabProps {
  newAnime: {
    title: string;
    description: string;
    type: 'series' | 'movie';
    genre: string;
    year: number;
    episodes: number;
    thumbnail_url: string;
  };
  onNewAnimeChange: (anime: any) => void;
  onCreateAnime: () => void;
  onUploadVideo: (file: File) => Promise<string>;
  onUploadThumbnail: (file: File) => Promise<string>;
}

export default function AddAnimeTab({
  newAnime,
  onNewAnimeChange,
  onCreateAnime,
  onUploadVideo,
  onUploadThumbnail,
}: AddAnimeTabProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({ title: 'Ошибка', description: 'Выберите видео файл', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const url = await onUploadVideo(file);
      onNewAnimeChange({...newAnime, video_url: url});
      setUploadProgress(100);
      toast({ title: 'Успех', description: 'Видео загружено!' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Ошибка', description: 'Выберите изображение', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    
    try {
      const url = await onUploadThumbnail(file);
      onNewAnimeChange({...newAnime, thumbnail_url: url});
      toast({ title: 'Успех', description: 'Обложка загружена!' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    }
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({ title: 'Ошибка', description: 'Выберите аудио файл', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    
    try {
      const url = await onUploadThumbnail(file);
      onNewAnimeChange({...newAnime, music_url: url});
      toast({ title: 'Успех', description: 'Музыка загружена!' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (musicInputRef.current) musicInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Обложка аниме</label>
        <div className="flex gap-2">
          <Input 
            ref={thumbnailInputRef}
            type="file" 
            accept="image/*"
            onChange={handleThumbnailUpload}
            disabled={isUploading}
            className="flex-1"
          />
          {newAnime.thumbnail_url && (
            <img src={newAnime.thumbnail_url} alt="Preview" className="w-12 h-16 object-cover rounded" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Видео файл аниме</label>
        <Input 
          ref={videoInputRef}
          type="file" 
          accept="video/*"
          onChange={handleVideoUpload}
          disabled={isUploading}
        />
        {isUploading && uploadProgress > 0 && (
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Музыка для аниме (опционально)</label>
        <Input 
          ref={musicInputRef}
          type="file" 
          accept="audio/*"
          onChange={handleMusicUpload}
          disabled={isUploading}
        />
      </div>

      <Input 
        placeholder="Название аниме" 
        value={newAnime.title}
        onChange={(e) => onNewAnimeChange({...newAnime, title: e.target.value})}
      />
      <Textarea 
        placeholder="Описание" 
        value={newAnime.description}
        onChange={(e) => onNewAnimeChange({...newAnime, description: e.target.value})}
        rows={4}
      />
      <Select value={newAnime.type} onValueChange={(v: 'series' | 'movie') => onNewAnimeChange({...newAnime, type: v})}>
        <SelectTrigger>
          <SelectValue placeholder="Тип" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="series">Сериал</SelectItem>
          <SelectItem value="movie">Фильм</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-4">
        <Input 
          placeholder="Жанр" 
          value={newAnime.genre}
          onChange={(e) => onNewAnimeChange({...newAnime, genre: e.target.value})}
        />
        <Input 
          placeholder="Год" 
          type="number"
          value={newAnime.year}
          onChange={(e) => onNewAnimeChange({...newAnime, year: parseInt(e.target.value)})}
        />
      </div>
      <Input 
        placeholder="Количество эпизодов" 
        type="number"
        value={newAnime.episodes}
        onChange={(e) => onNewAnimeChange({...newAnime, episodes: parseInt(e.target.value)})}
      />
      <Button 
        className="w-full" 
        onClick={onCreateAnime}
        disabled={isUploading || !newAnime.title}
      >
        <Icon name="Upload" size={16} className="mr-2" />
        Опубликовать аниме на сайт
      </Button>
    </div>
  );
}