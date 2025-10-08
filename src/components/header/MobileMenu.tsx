interface MobileMenuProps {
  isOpen: boolean;
  onSecurityClick: () => void;
}

export default function MobileMenu({ isOpen, onSecurityClick }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-border animate-in slide-in-from-top-2 duration-200">
      <nav className="flex flex-col py-4 space-y-1">
        <a href="#" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          🏠 Главная
        </a>
        <a href="#series" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          📺 Аниме-сериалы
        </a>
        <a href="#movies" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          🎬 Фильмы
        </a>
        <a href="#genres" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          🎭 Жанры
        </a>
        <a href="#top" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          ⭐ Топ
        </a>
        <a href="#new" className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80">
          🆕 Новинки
        </a>
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
