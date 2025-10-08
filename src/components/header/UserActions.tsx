import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { type User } from '@/lib/api';

interface UserActionsProps {
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

export default function UserActions({
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
}: UserActionsProps) {
  if (user) {
    return (
      <>
        <span className="text-sm text-muted-foreground hidden sm:inline truncate max-w-[120px]">{user.email}</span>
        {user.is_admin && (
          <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Админ</span>
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
          <Icon name="LogOut" size={16} className="sm:mr-2" />
          <span className="hidden sm:inline">Выйти</span>
        </Button>
      </>
    );
  }

  return (
    <>
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Icon name="LogIn" size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">Войти</span>
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
  );
}
