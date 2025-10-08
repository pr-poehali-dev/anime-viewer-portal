import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { type Anime } from '@/lib/api';

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
}

export default function AdminPanel({
  newAnime,
  onNewAnimeChange,
  onCreateAnime,
  animeList,
  onDeleteAnime,
  onChangePassword,
}: AdminPanelProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  return (
    <Tabs defaultValue="add" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="add">Добавить аниме</TabsTrigger>
        <TabsTrigger value="manage">Управление</TabsTrigger>
        <TabsTrigger value="password">Сменить пароль</TabsTrigger>
      </TabsList>
      <TabsContent value="add" className="space-y-4">
        <Input 
          placeholder="Название аниме" 
          value={newAnime.title}
          onChange={(e) => onNewAnimeChange({...newAnime, title: e.target.value})}
        />
        <Textarea 
          placeholder="Описание" 
          value={newAnime.description}
          onChange={(e) => onNewAnimeChange({...newAnime, description: e.target.value})}
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
        <Input 
          placeholder="Жанр" 
          value={newAnime.genre}
          onChange={(e) => onNewAnimeChange({...newAnime, genre: e.target.value})}
        />
        <Input 
          placeholder="Год выпуска" 
          type="number"
          value={newAnime.year}
          onChange={(e) => onNewAnimeChange({...newAnime, year: parseInt(e.target.value)})}
        />
        <Input 
          placeholder="Количество эпизодов" 
          type="number"
          value={newAnime.episodes}
          onChange={(e) => onNewAnimeChange({...newAnime, episodes: parseInt(e.target.value)})}
        />
        <Button className="w-full" onClick={onCreateAnime}>
          <Icon name="Plus" size={16} className="mr-2" />
          Опубликовать
        </Button>
      </TabsContent>
      <TabsContent value="manage" className="space-y-2 max-h-[400px] overflow-y-auto">
        {animeList.slice(0, 10).map(anime => (
          <div key={anime.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-3">
              <img src={anime.thumbnail_url} alt={anime.title} className="w-12 h-16 object-cover rounded" />
              <div>
                <p className="font-medium">{anime.title}</p>
                <p className="text-sm text-muted-foreground">{anime.genre} • {anime.year}</p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={() => onDeleteAnime(anime.id)}>
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        ))}
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