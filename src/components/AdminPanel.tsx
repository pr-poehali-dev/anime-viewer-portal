import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { type Anime } from '@/lib/api';
import AddAnimeTab from './admin/AddAnimeTab';
import ManageAnimeTab from './admin/ManageAnimeTab';
import PasswordTab from './admin/PasswordTab';
import BannersTab from './admin/BannersTab';

interface AdminPanelProps {
  newAnime: {
    title: string;
    description: string;
    type: 'series' | 'movie';
    genre: string;
    year: number;
    episodes: number;
    thumbnail_url: string;
  };
  onNewAnimeChange: (anime: any) => void;
  onCreateAnime: () => void;
  animeList: Anime[];
  onDeleteAnime: (id: number) => void;
  onUpdateAnime: (anime: Anime) => void;
  onChangePassword: (oldPassword: string, newPassword: string) => void;
  onUploadVideo: (file: File) => Promise<string>;
  onUploadThumbnail: (file: File) => Promise<string>;
}

export default function AdminPanel({
  newAnime,
  onNewAnimeChange,
  onCreateAnime,
  animeList,
  onDeleteAnime,
  onUpdateAnime,
  onChangePassword,
  onUploadVideo,
  onUploadThumbnail,
}: AdminPanelProps) {
  return (
    <Tabs defaultValue="add" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="add">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить аниме
        </TabsTrigger>
        <TabsTrigger value="manage">
          <Icon name="List" size={16} className="mr-2" />
          Управление ({animeList.length})
        </TabsTrigger>
        <TabsTrigger value="banners">
          <Icon name="Image" size={16} className="mr-2" />
          Баннеры
        </TabsTrigger>
        <TabsTrigger value="password">
          <Icon name="Key" size={16} className="mr-2" />
          Пароль
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="add">
        <AddAnimeTab
          newAnime={newAnime}
          onNewAnimeChange={onNewAnimeChange}
          onCreateAnime={onCreateAnime}
          onUploadVideo={onUploadVideo}
          onUploadThumbnail={onUploadThumbnail}
        />
      </TabsContent>
      
      <TabsContent value="manage">
        <ManageAnimeTab
          animeList={animeList}
          onDeleteAnime={onDeleteAnime}
          onUpdateAnime={onUpdateAnime}
        />
      </TabsContent>
      
      <TabsContent value="banners">
        <BannersTab />
      </TabsContent>
      
      <TabsContent value="password">
        <PasswordTab onChangePassword={onChangePassword} />
      </TabsContent>
    </Tabs>
  );
}