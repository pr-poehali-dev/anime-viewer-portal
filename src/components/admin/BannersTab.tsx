import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { perform_sql_query } from '@/lib/db';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  display_order: number;
}

export default function BannersTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState({
    title: '',
    image_url: '',
    link_url: '',
    display_order: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadBanners = async () => {
    try {
      setLoading(true);
      const result = await perform_sql_query(
        "SELECT * FROM t_p29917108_anime_viewer_portal.banners ORDER BY display_order ASC, created_at DESC"
      );
      setBanners(result as Banner[]);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить баннеры', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

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

    try {
      await perform_sql_query(
        `INSERT INTO t_p29917108_anime_viewer_portal.banners (title, image_url, link_url, display_order, created_by) 
         VALUES ('${newBanner.title.replace(/'/g, "''")}', '${newBanner.image_url.replace(/'/g, "''")}', '${newBanner.link_url.replace(/'/g, "''")}', ${newBanner.display_order}, 1)`
      );
      
      toast({ title: 'Успех', description: 'Баннер добавлен!' });
      setNewBanner({ title: '', image_url: '', link_url: '', display_order: 0 });
      loadBanners();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить баннер', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await perform_sql_query(
        `UPDATE t_p29917108_anime_viewer_portal.banners SET is_active = ${!isActive}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
      );
      toast({ title: 'Успех', description: 'Статус баннера изменен!' });
      loadBanners();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось изменить статус', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот баннер?')) return;

    try {
      await perform_sql_query(
        `DELETE FROM t_p29917108_anime_viewer_portal.banners WHERE id = ${id}`
      );
      toast({ title: 'Успех', description: 'Баннер удален!' });
      loadBanners();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить баннер', variant: 'destructive' });
    }
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
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        ) : banners.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Нет добавленных баннеров</p>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="p-4 border rounded-lg flex gap-4">
              <img src={banner.image_url} alt={banner.title} className="w-32 h-20 object-cover rounded" />
              
              <div className="flex-1">
                <h4 className="font-medium">{banner.title}</h4>
                <p className="text-sm text-muted-foreground">Порядок: {banner.display_order}</p>
                {banner.link_url && (
                  <p className="text-xs text-muted-foreground truncate">Ссылка: {banner.link_url}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant={banner.is_active ? 'default' : 'outline'}
                  onClick={() => handleToggleActive(banner.id, banner.is_active)}
                >
                  {banner.is_active ? 'Активен' : 'Скрыт'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(banner.id)}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
