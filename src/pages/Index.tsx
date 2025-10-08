import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const mockAnimeData = [
  {
    id: 1,
    title: 'Космический пират Харлок',
    type: 'series',
    rating: 9.2,
    year: 2024,
    genre: 'Приключения',
    episodes: 24,
    image: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
  },
  {
    id: 2,
    title: 'Последний самурай',
    type: 'movie',
    rating: 8.8,
    year: 2024,
    genre: 'Экшен',
    episodes: 1,
    image: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
  },
  {
    id: 3,
    title: 'Хроники магии',
    type: 'series',
    rating: 9.5,
    year: 2023,
    genre: 'Фэнтези',
    episodes: 12,
    image: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
  },
  {
    id: 4,
    title: 'Город будущего',
    type: 'movie',
    rating: 8.3,
    year: 2023,
    genre: 'Фантастика',
    episodes: 1,
    image: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
  },
  {
    id: 5,
    title: 'Академия героев',
    type: 'series',
    rating: 9.0,
    year: 2024,
    genre: 'Экшен',
    episodes: 24,
    image: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
  },
  {
    id: 6,
    title: 'Тайна древних',
    type: 'series',
    rating: 8.7,
    year: 2022,
    genre: 'Приключения',
    episodes: 13,
    image: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
  },
];

const genres = ['Все', 'Приключения', 'Экшен', 'Фэнтези', 'Фантастика', 'Комедия', 'Драма'];
const years = ['Все', '2024', '2023', '2022', '2021', '2020'];

export default function Index() {
  const [selectedGenre, setSelectedGenre] = useState('Все');
  const [selectedYear, setSelectedYear] = useState('Все');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const filteredAnime = mockAnimeData.filter(anime => {
    const matchesGenre = selectedGenre === 'Все' || anime.genre === selectedGenre;
    const matchesYear = selectedYear === 'Все' || anime.year.toString() === selectedYear;
    const matchesType = selectedType === 'all' || anime.type === selectedType;
    const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesYear && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Icon name="Film" size={28} />
                DOCK ANIME
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
                <a href="#series" className="text-sm font-medium hover:text-primary transition-colors">Аниме-сериалы</a>
                <a href="#movies" className="text-sm font-medium hover:text-primary transition-colors">Фильмы</a>
                <a href="#genres" className="text-sm font-medium hover:text-primary transition-colors">Жанры</a>
                <a href="#top" className="text-sm font-medium hover:text-primary transition-colors">Топ</a>
                <a href="#new" className="text-sm font-medium hover:text-primary transition-colors">Новинки</a>
                <a href="#random" className="text-sm font-medium hover:text-primary transition-colors">Случайное</a>
                <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="LogIn" size={16} className="mr-2" />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Вход в аккаунт</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Email" type="email" />
                    <Input placeholder="Пароль" type="password" />
                    <Button className="w-full">Войти</Button>
                    <p className="text-sm text-center text-muted-foreground">
                      Нет аккаунта? <button className="text-primary hover:underline">Зарегистрироваться</button>
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Icon name="Settings" size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Админ-панель</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="add" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="add">Добавить аниме</TabsTrigger>
                      <TabsTrigger value="manage">Управление</TabsTrigger>
                    </TabsList>
                    <TabsContent value="add" className="space-y-4">
                      <Input placeholder="Название аниме" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="series">Сериал</SelectItem>
                          <SelectItem value="movie">Фильм</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Жанр" />
                      <Input placeholder="Год выпуска" type="number" />
                      <Input placeholder="Количество эпизодов" type="number" />
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Icon name="Upload" size={32} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Загрузите видеофайл (4K)</p>
                        <p className="text-xs text-muted-foreground mt-1">Автоматическая конвертация в процессе загрузки</p>
                      </div>
                      <Button className="w-full">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Опубликовать
                      </Button>
                    </TabsContent>
                    <TabsContent value="manage" className="space-y-2">
                      {mockAnimeData.slice(0, 3).map(anime => (
                        <div key={anime.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                          <div className="flex items-center gap-3">
                            <img src={anime.image} alt={anime.title} className="w-12 h-16 object-cover rounded" />
                            <div>
                              <p className="font-medium">{anime.title}</p>
                              <p className="text-sm text-muted-foreground">{anime.genre} • {anime.year}</p>
                            </div>
                          </div>
                          <Button variant="destructive" size="sm">
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-background to-red-900/50">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(156, 39, 176, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 23, 68, 0.3) 0%, transparent 50%)',
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <h2 className="text-5xl font-bold mb-4 animate-fade-in">Добро пожаловать в DOCK</h2>
          <p className="text-lg text-muted-foreground mb-6 animate-fade-in">Смотри лучшие аниме в 4K качестве</p>
          <div className="flex gap-3 max-w-2xl animate-scale-in">
            <Input
              placeholder="Поиск аниме..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12"
            />
            <Button size="lg" className="px-6">
              <Icon name="Search" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="flex gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              size="sm"
            >
              Все
            </Button>
            <Button
              variant={selectedType === 'series' ? 'default' : 'outline'}
              onClick={() => setSelectedType('series')}
              size="sm"
            >
              Сериалы
            </Button>
            <Button
              variant={selectedType === 'movie' ? 'default' : 'outline'}
              onClick={() => setSelectedType('movie')}
              size="sm"
            >
              Фильмы
            </Button>
          </div>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Жанр" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredAnime.map(anime => (
            <Card key={anime.id} className="group hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={anime.image}
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
          ))}
        </div>

        {filteredAnime.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры фильтра</p>
          </div>
        )}
      </div>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Film" size={24} className="text-primary" />
              <span className="font-bold">DOCK ANIME</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Все права защищены</p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Mail" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
