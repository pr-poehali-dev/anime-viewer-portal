import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { type User } from '@/lib/api';
import { useState } from 'react';
import SecurityDialog from './header/SecurityDialog';
import NavigationMenu from './header/NavigationMenu';
import MobileMenu from './header/MobileMenu';
import UserActions from './header/UserActions';

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
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Icon name="Film" size={28} />
              DOCK ANIME
            </h1>
            <NavigationMenu />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>

            <SecurityDialog
              isOpen={isSecurityOpen}
              onOpenChange={setIsSecurityOpen}
              trigger={
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Icon name="Shield" size={16} className="mr-2" />
                  <span className="hidden lg:inline">Безопасность</span>
                </Button>
              }
            />
            
            <UserActions
              user={user}
              isAdminOpen={isAdminOpen}
              setIsAdminOpen={setIsAdminOpen}
              isLoginOpen={isLoginOpen}
              setIsLoginOpen={setIsLoginOpen}
              isRegisterOpen={isRegisterOpen}
              setIsRegisterOpen={setIsRegisterOpen}
              onLogout={onLogout}
              adminPanelContent={adminPanelContent}
              loginDialogContent={loginDialogContent}
              registerDialogContent={registerDialogContent}
            />
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onSecurityClick={() => setIsSecurityOpen(true)}
        />
      </div>
    </header>
  );
}
