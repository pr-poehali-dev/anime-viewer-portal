export default function NavigationMenu() {
  return (
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
  );
}
