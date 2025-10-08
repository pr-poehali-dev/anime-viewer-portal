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
  return (
    <Card 
      className="group hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden"
      onClick={() => onClick(anime)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={anime.thumbnail_url}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button className="w-full" size="sm">
            <Icon name="Play" size={16} className="mr-2" />
            Смотреть
          </Button>
        </div>
        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
          <Icon name="Star" size={12} className="mr-1" />
          {anime.rating}
        </Badge>
        <Badge className="absolute top-2 left-2" variant="secondary">
          {anime.type === 'series' ? `${anime.episodes} эп.` : 'Фильм'}
        </Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{anime.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{anime.genre}</span>
          <span>{anime.year}</span>
        </div>
      </CardContent>
    </Card>
  );
}
