import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { type Anime } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
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
  animeList: Anime[];
  onDeleteAnime: (id: number) => void;
  onChangePassword: (oldPassword: string, newPassword: string) => void;
  onUploadVideo: (file: File) => Promise<string>;
  onUploadThumbnail: (file: File) => Promise<string>;
}

export default function AdminPanel({
  newAnime,
  onNewAnimeChange,
  onCreateAnime,
  animeList,
  onDeleteAnime,
  onChangePassword,
  onUploadVideo,
  onUploadThumbnail,
}: AdminPanelProps) {
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

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
  return (
    <Tabs defaultValue="add" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="add">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить аниме
        </TabsTrigger>
        <TabsTrigger value="manage">
          <Icon name="List" size={16} className="mr-2" />
          Управление ({animeList.length})
        </TabsTrigger>
        <TabsTrigger value="password">
          <Icon name="Key" size={16} className="mr-2" />
          Пароль
        </TabsTrigger>
      </TabsList>
      <TabsContent value="add" className="space-y-4">
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
          disabled={isUploading || !newAnime.title || !newAnime.thumbnail_url}
        >
          <Icon name="Upload" size={16} className="mr-2" />
          Опубликовать аниме на сайт
        </Button>
      </TabsContent>
      <TabsContent value="manage" className="space-y-2 max-h-[500px] overflow-y-auto">
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Всего аниме на сайте: {animeList.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Вы можете удалить любое аниме из списка ниже</p>
        </div>
        {animeList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="FileX" size={48} className="mx-auto mb-2 opacity-50" />
            <p>Аниме пока нет. Добавьте первое!</p>
          </div>
        ) : (
          animeList.map(anime => (
            <div key={anime.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <img src={anime.thumbnail_url} alt={anime.title} className="w-12 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{anime.title}</p>
                  <p className="text-sm text-muted-foreground">{anime.genre} • {anime.year} • {anime.type === 'series' ? 'Сериал' : 'Фильм'}</p>
                  <p className="text-xs text-muted-foreground">Рейтинг: {anime.rating.toFixed(1)}/10 ({anime.rating_count} оценок)</p>
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => {
                  if (confirm(`Удалить "${anime.title}"? Это действие нельзя отменить.`)) {
                    onDeleteAnime(anime.id);
                  }
                }}
              >
                <Icon name="Trash2" size={16} className="mr-1" />
                Удалить
              </Button>
            </div>
          ))
        )}
      </TabsContent>
      <TabsContent value="password" className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Старый пароль</label>
            <Input 
              type="password"
              placeholder="Введите старый пароль" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Новый пароль</label>
            <Input 
              type="password"
              placeholder="Минимум 8 символов, буквы, цифры, спецсимволы" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Требования: минимум 8 символов, заглавная буква, строчная буква, цифра, спецсимвол
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Подтвердите новый пароль</label>
            <Input 
              type="password"
              placeholder="Повторите новый пароль" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={() => {
              if (newPassword !== confirmPassword) {
                alert('Пароли не совпадают!');
                return;
              }
              if (newPassword.length < 8) {
                alert('Пароль должен содержать минимум 8 символов');
                return;
              }
              onChangePassword(oldPassword, newPassword);
              setOldPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            disabled={!oldPassword || !newPassword || !confirmPassword}
          >
            <Icon name="Key" size={16} className="mr-2" />
            Изменить пароль
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}