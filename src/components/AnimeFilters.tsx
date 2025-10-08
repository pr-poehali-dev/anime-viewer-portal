import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnimeFiltersProps {
  selectedType: string;
  selectedGenre: string;
  selectedYear: string;
  onTypeChange: (type: string) => void;
  onGenreChange: (genre: string) => void;
  onYearChange: (year: string) => void;
  genres: string[];
  years: string[];
}

export default function AnimeFilters({
  selectedType,
  selectedGenre,
  selectedYear,
  onTypeChange,
  onGenreChange,
  onYearChange,
  genres,
  years,
}: AnimeFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8 items-center">
      <div className="flex gap-2">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          onClick={() => onTypeChange('all')}
          size="sm"
        >
          Все
        </Button>
        <Button
          variant={selectedType === 'series' ? 'default' : 'outline'}
          onClick={() => onTypeChange('series')}
          size="sm"
        >
          Сериалы
        </Button>
        <Button
          variant={selectedType === 'movie' ? 'default' : 'outline'}
          onClick={() => onTypeChange('movie')}
          size="sm"
        >
          Фильмы
        </Button>
      </div>

      <Select value={selectedGenre} onValueChange={onGenreChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Жанр" />
        </SelectTrigger>
        <SelectContent>
          {genres.map(genre => (
            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Год" />
        </SelectTrigger>
        <SelectContent>
          {years.map(year => (
            <SelectItem key={year} value={year}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
