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
  onUpdateAnime: (anime: Anime) => void;
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
  onUpdateAnime,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'year'>('title');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleSaveEdit = () => {
    if (!editingAnime) return;
    onUpdateAnime(editingAnime);
    setEditingAnime(null);
    toast({ title: 'Успех', description: 'Аниме обновлено!' });
  };

  const filteredAnimeList = animeList
    .filter(anime => 
      anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anime.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      return 0;
    });

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
      <TabsContent value="manage" className="space-y-3">
        <div className="p-3 bg-muted rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Всего аниме на сайте: {animeList.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Вы можете редактировать или удалить любое аниме</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                placeholder="🔍 Поиск по названию или жанру..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={(v: 'title' | 'rating' | 'year') => setSortBy(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">По названию</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="year">По году</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        
        {editingAnime && (
          <div className="mb-4 p-4 rounded-lg bg-primary/10 border-2 border-primary space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Icon name="Edit" size={18} />
                Редактирование: {editingAnime.title}
              </h4>
              <Button variant="ghost" size="sm" onClick={() => setEditingAnime(null)}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <Input 
              placeholder="Название"
              value={editingAnime.title}
              onChange={(e) => setEditingAnime({...editingAnime, title: e.target.value})}
            />
            <Textarea 
              placeholder="Описание"
              value={editingAnime.description || ''}
              onChange={(e) => setEditingAnime({...editingAnime, description: e.target.value})}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={editingAnime.type} 
                onValueChange={(v: 'series' | 'movie') => setEditingAnime({...editingAnime, type: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="series">Сериал</SelectItem>
                  <SelectItem value="movie">Фильм</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="Жанр"
                value={editingAnime.genre}
                onChange={(e) => setEditingAnime({...editingAnime, genre: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="Год"
                type="number"
                value={editingAnime.year}
                onChange={(e) => setEditingAnime({...editingAnime, year: parseInt(e.target.value)})}
              />
              <Input 
                placeholder="Эпизоды"
                type="number"
                value={editingAnime.episodes}
                onChange={(e) => setEditingAnime({...editingAnime, episodes: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Обложка (превью)</label>
              <div className="flex gap-2 items-center">
                <Input 
                  placeholder="URL обложки"
                  value={editingAnime.thumbnail_url || ''}
                  onChange={(e) => setEditingAnime({...editingAnime, thumbnail_url: e.target.value})}
                  className="flex-1"
                />
                {editingAnime.thumbnail_url && (
                  <img 
                    src={editingAnime.thumbnail_url} 
                    alt="Preview" 
                    className="w-10 h-14 object-cover rounded border"
                  />
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSaveEdit}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить изменения
              </Button>
              <Button variant="outline" onClick={() => setEditingAnime(null)}>
                <Icon name="X" size={16} className="mr-2" />
                Отмена
              </Button>
            </div>
          </div>
        )}

        {filteredAnimeList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name={searchTerm ? "Search" : "FileX"} size={48} className="mx-auto mb-2 opacity-50" />
            <p>{searchTerm ? 'Ничего не найдено' : 'Аниме пока нет. Добавьте первое!'}</p>
            {searchTerm && (
              <Button variant="link" size="sm" onClick={() => setSearchTerm('')}>
                Очистить поиск
              </Button>
            )}
          </div>
        ) : (
          filteredAnimeList.map(anime => (
            <div key={anime.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <img src={anime.thumbnail_url} alt={anime.title} className="w-12 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{anime.title}</p>
                  <p className="text-sm text-muted-foreground">{anime.genre} • {anime.year} • {anime.type === 'series' ? 'Сериал' : 'Фильм'}</p>
                  <p className="text-xs text-muted-foreground">Рейтинг: {anime.rating.toFixed(1)}/10 ({anime.rating_count} оценок)</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingAnime(anime)}
                >
                  <Icon name="Edit" size={16} className="mr-1" />
                  Изменить
                </Button>
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