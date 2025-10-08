import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { api, type Anime, type User } from '@/lib/api';

const genres = ['Все', 'Приключения', 'Экшен', 'Фэнтези', 'Фантастика', 'Комедия', 'Драма'];
const years = ['Все', '2024', '2023', '2022', '2021', '2020'];

export default function Index() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('Все');
  const [selectedYear, setSelectedYear] = useState('Все');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAnimeDetailsOpen, setIsAnimeDetailsOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [newComment, setNewComment] = useState('');
  
  const [newAnime, setNewAnime] = useState({
    title: '',
    description: '',
    type: 'series' as 'series' | 'movie',
    genre: '',
    year: new Date().getFullYear(),
    episodes: 1,
    thumbnail_url: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
  });

  useEffect(() => {
    loadAnime();
    verifyAuth();
  }, []);

  useEffect(() => {
    loadAnime();
  }, [selectedType, selectedGenre, selectedYear, searchQuery]);

  const verifyAuth = async () => {
    try {
      const userData = await api.auth.verify();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  const loadAnime = async () => {
    try {
      setLoading(true);
      const data = await api.anime.getAll({
        type: selectedType,
        genre: selectedGenre,
        year: selectedYear,
        search: searchQuery,
      });
      setAnimeList(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить аниме',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const { token, user: userData } = await api.auth.login(loginEmail, loginPassword);
      localStorage.setItem('auth_token', token);
      setUser(userData);
      setIsLoginOpen(false);
      toast({ title: 'Успешный вход', description: `Добро пожаловать, ${userData.email}!` });
    } catch (error: any) {
      toast({ title: 'Ошибка входа', description: error.message, variant: 'destructive' });
    }
  };

  const handleRegister = async () => {
    try {
      const { token, user: userData } = await api.auth.register(loginEmail, loginPassword);
      localStorage.setItem('auth_token', token);
      setUser(userData);
      setIsRegisterOpen(false);
      toast({ title: 'Регистрация успешна', description: 'Добро пожаловать!' });
    } catch (error: any) {
      toast({ title: 'Ошибка регистрации', description: error.message, variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast({ title: 'Выход выполнен' });
  };

  const handleCreateAnime = async () => {
    try {
      await api.anime.create(newAnime);
      toast({ title: 'Успех', description: 'Аниме добавлено!' });
      loadAnime();
      setNewAnime({
        title: '',
        description: '',
        type: 'series',
        genre: '',
        year: new Date().getFullYear(),
        episodes: 1,
        thumbnail_url: 'https://v3b.fal.media/files/b/tiger/UXPfrGySjtBEuDWgc5z29_output.png',
      });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteAnime = async (id: number) => {
    try {
      await api.anime.delete(id);
      toast({ title: 'Успех', description: 'Аниме удалено!' });
      loadAnime();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddComment = async () => {
    if (!selectedAnime || !newComment.trim()) return;
    
    try {
      await api.comments.create(selectedAnime.id, newComment);
      toast({ title: 'Комментарий добавлен' });
      setNewComment('');
      const updatedAnime = await api.anime.getById(selectedAnime.id);
      setSelectedAnime(updatedAnime);
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleRate = async (rating: number) => {
    if (!selectedAnime) return;
    
    try {
      await api.ratings.rate(selectedAnime.id, rating);
      toast({ title: 'Оценка сохранена', description: `Вы поставили ${rating}/10` });
      const updatedAnime = await api.anime.getById(selectedAnime.id);
      setSelectedAnime(updatedAnime);
      loadAnime();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const openAnimeDetails = async (anime: Anime) => {
    try {
      const fullAnime = await api.anime.getById(anime.id);
      setSelectedAnime(fullAnime);
      setIsAnimeDetailsOpen(true);
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

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
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  {user.is_admin && (
                    <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Icon name="Settings" size={16} className="mr-2" />
                          Админ
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
                            <Input 
                              placeholder="Название аниме" 
                              value={newAnime.title}
                              onChange={(e) => setNewAnime({...newAnime, title: e.target.value})}
                            />
                            <Textarea 
                              placeholder="Описание" 
                              value={newAnime.description}
                              onChange={(e) => setNewAnime({...newAnime, description: e.target.value})}
                            />
                            <Select value={newAnime.type} onValueChange={(v: 'series' | 'movie') => setNewAnime({...newAnime, type: v})}>
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
                              onChange={(e) => setNewAnime({...newAnime, genre: e.target.value})}
                            />
                            <Input 
                              placeholder="Год выпуска" 
                              type="number"
                              value={newAnime.year}
                              onChange={(e) => setNewAnime({...newAnime, year: parseInt(e.target.value)})}
                            />
                            <Input 
                              placeholder="Количество эпизодов" 
                              type="number"
                              value={newAnime.episodes}
                              onChange={(e) => setNewAnime({...newAnime, episodes: parseInt(e.target.value)})}
                            />
                            <Button className="w-full" onClick={handleCreateAnime}>
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
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteAnime(anime.id)}>
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти
                  </Button>
                </>
              ) : (
                <>
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
                        <Input 
                          placeholder="Email" 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                        <Input 
                          placeholder="Пароль" 
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleLogin}>Войти</Button>
                        <p className="text-sm text-center text-muted-foreground">
                          Нет аккаунта? <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} className="text-primary hover:underline">Зарегистрироваться</button>
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Регистрация</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input 
                          placeholder="Email" 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                        <Input 
                          placeholder="Пароль" 
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleRegister}>Зарегистрироваться</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
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

        {loading ? (
          <div className="flex justify-center py-16">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {animeList.map(anime => (
              <Card 
                key={anime.id} 
                className="group hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden"
                onClick={() => openAnimeDetails(anime)}
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
            ))}
          </div>
        )}

        {animeList.length === 0 && !loading && (
          <div className="text-center py-16">
            <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры фильтра</p>
          </div>
        )}
      </div>

      <Dialog open={isAnimeDetailsOpen} onOpenChange={setIsAnimeDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedAnime && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedAnime.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <img 
                    src={selectedAnime.thumbnail_url} 
                    alt={selectedAnime.title}
                    className="w-full rounded-lg"
                  />
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Описание</h3>
                      <p className="text-sm text-muted-foreground">{selectedAnime.description || 'Описание отсутствует'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Жанр:</span> {selectedAnime.genre}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Год:</span> {selectedAnime.year}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Тип:</span> {selectedAnime.type === 'series' ? 'Сериал' : 'Фильм'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Эпизоды:</span> {selectedAnime.episodes}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Рейтинг:</span> {selectedAnime.rating}/10 ({selectedAnime.rating_count} оценок)
                      </div>
                    </div>

                    {user && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Ваша оценка</h3>
                        <div className="flex gap-2 flex-wrap">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                            <Button
                              key={rating}
                              variant="outline"
                              size="sm"
                              onClick={() => handleRate(rating)}
                            >
                              {rating}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Комментарии ({selectedAnime.comments?.length || 0})</h3>
                  
                  {user ? (
                    <div className="mb-4 space-y-2">
                      <Textarea 
                        placeholder="Напишите комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button onClick={handleAddComment}>
                        <Icon name="Send" size={16} className="mr-2" />
                        Отправить
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">Войдите, чтобы оставить комментарий</p>
                  )}

                  <div className="space-y-3">
                    {selectedAnime.comments?.map(comment => (
                      <div key={comment.id} className="p-3 rounded-lg bg-card border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium">{comment.email}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.comment_text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
