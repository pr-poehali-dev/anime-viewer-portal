import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { type Anime } from '@/lib/api';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
}

export default function AnimeCard({ anime, onClick }: AnimeCardProps) {
  const rating = Number(anime.rating) || 0;
  
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'bg-green-500';
    if (rating >= 7) return 'bg-blue-500';
    if (rating >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card 
      className="group hover:scale-[1.02] md:hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden active:scale-95"
      onClick={() => onClick(anime)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={anime.thumbnail_url}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Градиент всегда видимый на мобильных */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Кнопка "Смотреть" - всегда видна на мобильных */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
          <Button className="w-full shadow-lg" size="sm">
            <Icon name="Play" size={16} className="mr-2" />
            Смотреть
          </Button>
        </div>
        
        {/* Рейтинг с цветовой индикацией */}
        <Badge className={`absolute top-2 right-2 ${getRatingColor(rating)} text-white border-0 shadow-lg`}>
          <Icon name="Star" size={12} className="mr-1 fill-white" />
          {rating.toFixed(1)}
        </Badge>
        
        {/* Тип аниме */}
        <Badge className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white border-0 shadow-lg" variant="secondary">
          {anime.type === 'series' ? `${anime.episodes} эп.` : 'Фильм'}
        </Badge>
        
        {/* Счётчик просмотров (уникальная фишка) */}
        {anime.rating_count > 0 && (
          <Badge className="absolute bottom-14 md:bottom-20 right-2 bg-black/60 backdrop-blur-sm text-white border-0 shadow-lg text-xs">
            <Icon name="Eye" size={10} className="mr-1" />
            {anime.rating_count}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-3 space-y-2">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{anime.title}</h3>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground truncate flex-1 mr-2">{anime.genre}</span>
          <span className="text-muted-foreground whitespace-nowrap">{anime.year}</span>
        </div>
        
        {/* Прогресс-бар для популярности (уникальная фишка) */}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((rating / 10) * 100, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}