import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { api, type Anime, type User } from '@/lib/api';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AnimeFilters from '@/components/AnimeFilters';
import AnimeCard from '@/components/AnimeCard';
import AnimeDetailsDialog from '@/components/AnimeDetailsDialog';
import AdminPanel from '@/components/AdminPanel';
import Footer from '@/components/Footer';
import RandomAnimeButton from '@/components/RandomAnimeButton';

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

  const handleUpdateAnime = async (anime: Anime) => {
    try {
      await api.anime.update(anime);
      toast({ title: 'Успех', description: 'Аниме обновлено!' });
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

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await api.password.change(oldPassword, newPassword);
      toast({ title: 'Успех', description: 'Пароль успешно изменён!' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleUploadVideo = async (file: File): Promise<string> => {
    try {
      const url = await api.upload.file(file);
      toast({ title: 'Успех', description: 'Видео загружено!' });
      return url;
    } catch (error: any) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить видео', variant: 'destructive' });
      throw error;
    }
  };

  const handleUploadThumbnail = async (file: File): Promise<string> => {
    try {
      const url = await api.upload.file(file);
      return url;
    } catch (error: any) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить обложку', variant: 'destructive' });
      throw error;
    }
  };

  const loginDialogContent = (
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
  );

  const registerDialogContent = (
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
  );

  const adminPanelContent = (
    <AdminPanel
      newAnime={newAnime}
      onNewAnimeChange={setNewAnime}
      onCreateAnime={handleCreateAnime}
      animeList={animeList}
      onDeleteAnime={handleDeleteAnime}
      onUpdateAnime={handleUpdateAnime}
      onChangePassword={handleChangePassword}
      onUploadVideo={handleUploadVideo}
      onUploadThumbnail={handleUploadThumbnail}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
        onLogout={handleLogout}
        adminPanelContent={adminPanelContent}
        loginDialogContent={loginDialogContent}
        registerDialogContent={registerDialogContent}
      />

      <HeroSection 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container mx-auto px-4 py-8">
        <AnimeFilters
          selectedType={selectedType}
          selectedGenre={selectedGenre}
          selectedYear={selectedYear}
          onTypeChange={setSelectedType}
          onGenreChange={setSelectedGenre}
          onYearChange={setSelectedYear}
          genres={genres}
          years={years}
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : animeList.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {animeList.map(anime => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onClick={openAnimeDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Кнопка случайного аниме */}
      <RandomAnimeButton 
        animeList={animeList}
        onSelect={openAnimeDetails}
      />

      <AnimeDetailsDialog
        open={isAnimeDetailsOpen}
        onOpenChange={setIsAnimeDetailsOpen}
        anime={selectedAnime}
        user={user}
        newComment={newComment}
        onCommentChange={setNewComment}
        onAddComment={handleAddComment}
        onRate={handleRate}
      />

      <Footer />
    </div>
  );
}