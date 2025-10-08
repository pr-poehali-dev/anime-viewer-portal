import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { type Anime } from '@/lib/api';

interface AnimeListItemProps {
  anime: Anime;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onEdit: (anime: Anime) => void;
  onDelete: (id: number) => void;
}

export default function AnimeListItem({
  anime,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}: AnimeListItemProps) {
  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg bg-card border transition-colors ${
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary'
      }`}
    >
      <button
        onClick={() => onToggleSelect(anime.id)}
        className="flex-shrink-0 w-5 h-5 rounded border-2 border-primary flex items-center justify-center transition-colors hover:bg-primary/10"
      >
        {isSelected && (
          <Icon name="Check" size={14} className="text-primary" />
        )}
      </button>
      
      <img src={anime.thumbnail_url} alt={anime.title} className="w-12 h-16 object-cover rounded" />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{anime.title}</p>
        <p className="text-sm text-muted-foreground">{anime.genre} • {anime.year} • {anime.type === 'series' ? 'Сериал' : 'Фильм'}</p>
        <p className="text-xs text-muted-foreground">Рейтинг: {Number(anime.rating).toFixed(1)}/10 ({anime.rating_count} оценок)</p>
      </div>
      
      <div className="flex gap-2 flex-shrink-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(anime)}
        >
          <Icon name="Edit" size={16} className="mr-1" />
          Изменить
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => {
            if (confirm(`Удалить "${anime.title}"? Это действие нельзя отменить.`)) {
              onDelete(anime.id);
            }
          }}
        >
          <Icon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  );
}
