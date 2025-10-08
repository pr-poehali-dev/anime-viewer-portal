import { Link } from 'react-router-dom';

export default function NavigationMenu() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Главная</Link>
      <Link to="/anime?type=series" className="text-sm font-medium hover:text-primary transition-colors">Сериалы</Link>
      <Link to="/anime?type=movie" className="text-sm font-medium hover:text-primary transition-colors">Фильмы</Link>
      <Link to="/genres" className="text-sm font-medium hover:text-primary transition-colors">Жанры</Link>
      <Link to="/anime" className="text-sm font-medium hover:text-primary transition-colors">Все аниме</Link>
    </nav>
  );
}