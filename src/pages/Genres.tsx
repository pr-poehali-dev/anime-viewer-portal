import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import AdminPanel from '@/components/AdminPanel';
import { useAnime } from '@/hooks/useAnime';
import { Input } from '@/components/ui/input';

const genres = [
  { name: 'Приключения', emoji: '🗺️', description: 'Захватывающие путешествия и открытия' },
  { name: 'Экшен', emoji: '⚔️', description: 'Битвы и динамичные сцены' },
  { name: 'Фэнтези', emoji: '🧙', description: 'Магия и фантастические миры' },
  { name: 'Фантастика', emoji: '🚀', description: 'Космос и технологии будущего' },
  { name: 'Комедия', emoji: '😂', description: 'Юмор и смешные ситуации' },
  { name: 'Драма', emoji: '🎭', description: 'Глубокие эмоции и переживания' },
];

export default function Genres() {
  const navigate = useNavigate();
  const auth = useAuth();
  const anime = useAnime();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleLoginSubmit = async () => {
    const success = await auth.handleLogin();
    if (success) setIsLoginOpen(false);
  };

  const handleRegisterSubmit = async () => {
    const success = await auth.handleRegister();
    if (success) setIsRegisterOpen(false);
  };

  const handleCreateAnime = async () => {
    await anime.handleCreateAnime();
  };

  const handleDeleteAnime = async (id: number) => {
    await anime.handleDeleteAnime(id);
  };

  const handleUpdateAnime = async (animeData: any) => {
    await anime.handleUpdateAnime(animeData);
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
        <h1 className="text-4xl font-bold mb-8 text-center">Жанры аниме</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre) => (
            <div
              key={genre.name}
              onClick={() => navigate(`/anime?genre=${genre.name}`)}
              className="bg-card hover:bg-accent rounded-lg p-6 cursor-pointer transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-6xl mb-4 text-center">{genre.emoji}</div>
              <h2 className="text-2xl font-bold mb-2 text-center">{genre.name}</h2>
              <p className="text-muted-foreground text-center">{genre.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
