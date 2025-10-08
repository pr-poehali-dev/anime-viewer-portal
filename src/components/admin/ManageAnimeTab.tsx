import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { type Anime } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import AnimeListItem from './AnimeListItem';
import EditAnimeForm from './EditAnimeForm';

interface ManageAnimeTabProps {
  animeList: Anime[];
  onDeleteAnime: (id: number) => void;
  onUpdateAnime: (anime: Anime) => void;
}

export default function ManageAnimeTab({
  animeList,
  onDeleteAnime,
  onUpdateAnime,
}: ManageAnimeTabProps) {
  const { toast } = useToast();
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'year'>('title');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSaveEdit = () => {
    if (!editingAnime) return;
    onUpdateAnime(editingAnime);
    setEditingAnime(null);
    toast({ title: 'Успех', description: 'Аниме обновлено!' });
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAnimeList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAnimeList.map(a => a.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    
    const confirmMsg = `Удалить ${selectedIds.length} аниме? Это действие нельзя отменить.`;
    if (!confirm(confirmMsg)) return;

    const count = selectedIds.length;
    selectedIds.forEach(id => onDeleteAnime(id));
    setSelectedIds([]);
    
    toast({ 
      title: 'Успех', 
      description: `Удалено ${count} аниме` 
    });
  };

  const handleExportToExcel = () => {
    const data = animeList.map(anime => ({
      'ID': anime.id,
      'Название': anime.title,
      'Описание': anime.description || '',
      'Тип': anime.type === 'series' ? 'Сериал' : 'Фильм',
      'Жанр': anime.genre,
      'Год': anime.year,
      'Эпизоды': anime.episodes,
      'Рейтинг': Number(anime.rating).toFixed(1),
      'Оценок': anime.rating_count,
      'Обложка': anime.thumbnail_url || '',
      'Видео': anime.video_url || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Аниме');
    
    const fileName = `anime_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast({ 
      title: 'Экспорт завершён', 
      description: `Файл ${fileName} скачан` 
    });
  };

  const filteredAnimeList = animeList
    .filter(anime => 
      anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anime.genre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'year') return b.year - a.year;
      return 0;
    });

  return (
    <div className="space-y-3">
      <div className="p-3 bg-muted rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Всего аниме на сайте: {animeList.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedIds.length > 0 
                ? `Выбрано: ${selectedIds.length} аниме`
                : 'Вы можете редактировать или удалить любое аниме'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportToExcel}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Excel
            </Button>
            {selectedIds.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить ({selectedIds.length})
              </Button>
            )}
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

        {filteredAnimeList.length > 0 && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSelectAll}
            >
              <Icon name={selectedIds.length === filteredAnimeList.length ? "CheckSquare" : "Square"} size={16} className="mr-2" />
              {selectedIds.length === filteredAnimeList.length ? 'Снять выделение' : 'Выбрать все'}
            </Button>
            {selectedIds.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {selectedIds.length} из {filteredAnimeList.length}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {editingAnime && (
          <EditAnimeForm
            editingAnime={editingAnime}
            onUpdate={setEditingAnime}
            onCancel={() => setEditingAnime(null)}
            onSave={handleSaveEdit}
          />
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
            <AnimeListItem
              key={anime.id}
              anime={anime}
              isSelected={selectedIds.includes(anime.id)}
              onToggleSelect={handleToggleSelect}
              onEdit={setEditingAnime}
              onDelete={onDeleteAnime}
            />
          ))
        )}
      </div>
    </div>
  );
}
