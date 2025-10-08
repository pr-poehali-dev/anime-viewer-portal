import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { type User } from '@/lib/api';

interface HeaderProps {
  user: User | null;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;
  onLogout: () => void;
  adminPanelContent: React.ReactNode;
  loginDialogContent: React.ReactNode;
  registerDialogContent: React.ReactNode;
}

export default function Header({
  user,
  isAdminOpen,
  setIsAdminOpen,
  isLoginOpen,
  setIsLoginOpen,
  isRegisterOpen,
  setIsRegisterOpen,
  onLogout,
  adminPanelContent,
  loginDialogContent,
  registerDialogContent,
}: HeaderProps) {
  return (
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
                      {adminPanelContent}
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="outline" size="sm" onClick={onLogout}>
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
                    {loginDialogContent}
                  </DialogContent>
                </Dialog>

                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Регистрация</DialogTitle>
                    </DialogHeader>
                    {registerDialogContent}
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
