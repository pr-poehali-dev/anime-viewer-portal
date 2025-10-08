import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onSecurityClick: () => void;
}

export default function MobileMenu({ isOpen, onSecurityClick }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-border animate-in slide-in-from-top-2 duration-200">
      <nav className="flex flex-col py-4 space-y-1">
        <Link to="/" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          🏠 Главная
        </Link>
        <Link to="/anime?type=series" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          📺 Сериалы
        </Link>
        <Link to="/anime?type=movie" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          🎬 Фильмы
        </Link>
        <Link to="/genres" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          🎭 Жанры
        </Link>
        <Link to="/anime" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          📚 Все аниме
        </Link>
        <button 
          onClick={onSecurityClick}
          className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80 text-left"
        >
          🛡️ Безопасность
        </button>
      </nav>
    </div>
  );
}