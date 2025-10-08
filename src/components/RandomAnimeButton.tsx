import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { type Anime } from '@/lib/api';

interface RandomAnimeButtonProps {
  animeList: Anime[];
  onSelect: (anime: Anime) => void;
}

export default function RandomAnimeButton({ animeList, onSelect }: RandomAnimeButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandomClick = () => {
    if (animeList.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    
    // Анимация "рулетки"
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setIsSpinning(false);
        
        // Выбираем случайное аниме
        const randomIndex = Math.floor(Math.random() * animeList.length);
        const randomAnime = animeList[randomIndex];
        onSelect(randomAnime);
      }
    }, 100);
  };

  return (
    <Button
      onClick={handleRandomClick}
      disabled={isSpinning}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl z-40 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      size="icon"
    >
      <Icon 
        name="Shuffle" 
        size={24} 
        className={isSpinning ? 'animate-spin' : 'animate-pulse'}
      />
    </Button>
  );
}
