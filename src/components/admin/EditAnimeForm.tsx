import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { type Anime } from '@/lib/api';

interface EditAnimeFormProps {
  editingAnime: Anime;
  onUpdate: (anime: Anime) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditAnimeForm({
  editingAnime,
  onUpdate,
  onCancel,
  onSave,
}: EditAnimeFormProps) {
  return (
    <div className="mb-4 p-4 rounded-lg bg-primary/10 border-2 border-primary space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold flex items-center gap-2">
          <Icon name="Edit" size={18} />
          Редактирование: {editingAnime.title}
        </h4>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <Icon name="X" size={16} />
        </Button>
      </div>
      
      <Input 
        placeholder="Название"
        value={editingAnime.title}
        onChange={(e) => onUpdate({...editingAnime, title: e.target.value})}
      />
      <Textarea 
        placeholder="Описание"
        value={editingAnime.description || ''}
        onChange={(e) => onUpdate({...editingAnime, description: e.target.value})}
        rows={3}
      />
      <div className="grid grid-cols-2 gap-2">
        <Select 
          value={editingAnime.type} 
          onValueChange={(v: 'series' | 'movie') => onUpdate({...editingAnime, type: v})}
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
          onChange={(e) => onUpdate({...editingAnime, genre: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input 
          placeholder="Год"
          type="number"
          value={editingAnime.year}
          onChange={(e) => onUpdate({...editingAnime, year: parseInt(e.target.value)})}
        />
        <Input 
          placeholder="Эпизоды"
          type="number"
          value={editingAnime.episodes}
          onChange={(e) => onUpdate({...editingAnime, episodes: parseInt(e.target.value)})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Обложка (превью)</label>
        <div className="flex gap-2 items-center">
          <Input 
            placeholder="URL обложки"
            value={editingAnime.thumbnail_url || ''}
            onChange={(e) => onUpdate({...editingAnime, thumbnail_url: e.target.value})}
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
        <Button className="flex-1" onClick={onSave}>
          <Icon name="Save" size={16} className="mr-2" />
          Сохранить изменения
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <Icon name="X" size={16} className="mr-2" />
          Отмена
        </Button>
      </div>
    </div>
  );
}
