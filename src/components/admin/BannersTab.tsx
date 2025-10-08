import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  display_order: number;
}

export default function BannersTab() {
  const [banners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState({
    title: '',
    image_url: '',
    link_url: '',
    display_order: 0,
  });
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Ошибка', description: 'Выберите изображение', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setNewBanner({ ...newBanner, image_url: reader.result as string });
      toast({ title: 'Успех', description: 'Изображение загружено!' });
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!newBanner.title || !newBanner.image_url) {
      toast({ title: 'Ошибка', description: 'Заполните название и загрузите изображение', variant: 'destructive' });
      return;
    }

    toast({ title: 'Информация', description: 'Функция будет доступна после обновления подписки' });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">Добавить новый баннер</h3>
        
        <Input
          placeholder="Название баннера"
          value={newBanner.title}
          onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Изображение баннера</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {newBanner.image_url && (
            <img src={newBanner.image_url} alt="Preview" className="w-full max-w-md rounded" />
          )}
        </div>

        <Input
          placeholder="Ссылка (необязательно)"
          value={newBanner.link_url}
          onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Порядок отображения"
          value={newBanner.display_order}
          onChange={(e) => setNewBanner({ ...newBanner, display_order: parseInt(e.target.value) || 0 })}
        />

        <Button onClick={handleCreate} className="w-full">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить баннер
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Список баннеров ({banners.length})</h3>
        <p className="text-muted-foreground text-center py-8">Нет добавленных баннеров</p>
      </div>
    </div>
  );
}