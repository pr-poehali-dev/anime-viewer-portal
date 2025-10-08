import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import AnimeFilters from '@/components/AnimeFilters';
import AnimeCard from '@/components/AnimeCard';
import AnimeDetailsDialog from '@/components/AnimeDetailsDialog';
import AdminPanel from '@/components/AdminPanel';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useAnime } from '@/hooks/useAnime';
import { useComments } from '@/hooks/useComments';

const genres = ['Все', 'Приключения', 'Экшен', 'Фэнтези', 'Фантастика', 'Комедия', 'Драма'];
const years = ['Все', '2024', '2023', '2022', '2021', '2020'];

export default function Anime() {
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'Все');
  const [selectedYear, setSelectedYear] = useState('Все');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAnimeDetailsOpen, setIsAnimeDetailsOpen] = useState(false);

  const auth = useAuth();
  const anime = useAnime();
  const comments = useComments();

  useEffect(() => {
    anime.loadAnime({ selectedType, selectedGenre, selectedYear, searchQuery });
    auth.verifyAuth();
  }, []);

  useEffect(() => {
    anime.loadAnime({ selectedType, selectedGenre, selectedYear, searchQuery });
  }, [selectedType, selectedGenre, selectedYear, searchQuery]);

  const handleLoginSubmit = async () => {
    const success = await auth.handleLogin();
    if (success) setIsLoginOpen(false);
  };

  const handleRegisterSubmit = async () => {
    const success = await auth.handleRegister();
    if (success) setIsRegisterOpen(false);
  };

  const handleCreateAnime = async () => {
    const success = await anime.handleCreateAnime();
    if (success) {
      anime.loadAnime({ selectedType, selectedGenre, selectedYear, searchQuery });
    }
  };

  const handleDeleteAnime = async (id: number) => {
    await anime.handleDeleteAnime(id);
    anime.loadAnime({ selectedType, selectedGenre, selectedYear, searchQuery });
  };

  const handleUpdateAnime = async (animeData: any) => {
    await anime.handleUpdateAnime(animeData);
    anime.loadAnime({ selectedType, selectedGenre, selectedYear, searchQuery });
  };

  const handleOpenAnimeDetails = async (animeData: any) => {
    const success = await anime.openAnimeDetails(animeData);
    if (success) setIsAnimeDetailsOpen(true);
  };

  const handleAddComment = () => {
    comments.handleAddComment(anime.selectedAnime, anime.setSelectedAnime);
  };

  const handleRate = (rating: number) => {
    comments.handleRate(
      anime.selectedAnime,
      rating,
      anime.setSelectedAnime,
      () => anime.loadAnime({ selectedType, selectedGenre, selectedYear, searchQuery })
    );
  };

  const loginDialogContent = (
    <div className="space-y-4 py-4">
      <Input 
        placeholder="Email" 
        type="email" 
        value={auth.loginEmail}
        onChange={(e) => auth.setLoginEmail(e.target.value)}
      />
      <Input 
        placeholder="Пароль" 
        type="password"
        value={auth.loginPassword}
        onChange={(e) => auth.setLoginPassword(e.target.value)}
      />
      <button className="w-full bg-primary text-primary-foreground py-2 rounded-md" onClick={handleLoginSubmit}>Войти</button>
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
        value={auth.loginEmail}
        onChange={(e) => auth.setLoginEmail(e.target.value)}
      />
      <Input 
        placeholder="Пароль" 
        type="password"
        value={auth.loginPassword}
        onChange={(e) => auth.setLoginPassword(e.target.value)}
      />
      <button className="w-full bg-primary text-primary-foreground py-2 rounded-md" onClick={handleRegisterSubmit}>Зарегистрироваться</button>
    </div>
  );

  const adminPanelContent = (
    <AdminPanel
      newAnime={anime.newAnime}
      onNewAnimeChange={anime.setNewAnime}
      onCreateAnime={handleCreateAnime}
      animeList={anime.animeList}
      onDeleteAnime={handleDeleteAnime}
      onUpdateAnime={handleUpdateAnime}
      onChangePassword={auth.handleChangePassword}
      onUploadVideo={anime.handleUploadVideo}
      onUploadThumbnail={anime.handleUploadThumbnail}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={auth.user}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
        onLogout={auth.handleLogout}
        adminPanelContent={adminPanelContent}
        loginDialogContent={loginDialogContent}
        registerDialogContent={registerDialogContent}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Поиск аниме..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

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

        {anime.loading ? (
          <div className="flex justify-center py-16">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : anime.animeList.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {anime.animeList.map(item => (
              <AnimeCard
                key={item.id}
                anime={item}
                onClick={handleOpenAnimeDetails}
              />
            ))}
          </div>
        )}
      </div>

      <AnimeDetailsDialog
        open={isAnimeDetailsOpen}
        onOpenChange={setIsAnimeDetailsOpen}
        anime={anime.selectedAnime}
        user={auth.user}
        newComment={comments.newComment}
        onCommentChange={comments.setNewComment}
        onAddComment={handleAddComment}
        onRate={handleRate}
      />

      <Footer />
    </div>
  );
}