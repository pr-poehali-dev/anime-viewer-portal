import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-900/50 via-background to-red-900/50 p-8">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(156, 39, 176, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 23, 68, 0.3) 0%, transparent 50%)',
        }} />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">Добро пожаловать в DOCK</h2>
          <p className="text-lg text-muted-foreground mb-6 animate-fade-in">Смотри лучшие аниме в высоком качестве</p>
          <div className="flex gap-3 max-w-2xl animate-scale-in">
            <Input
              placeholder="Поиск аниме..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-12"
            />
            <Button size="lg" className="px-6">
              <Icon name="Search" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}