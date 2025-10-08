import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { type Anime, type User } from '@/lib/api';

interface AnimeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anime: Anime | null;
  user: User | null;
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
  onRate: (rating: number) => void;
}

export default function AnimeDetailsDialog({
  open,
  onOpenChange,
  anime,
  user,
  newComment,
  onCommentChange,
  onAddComment,
  onRate,
}: AnimeDetailsDialogProps) {
  if (!anime) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <div>
          <DialogHeader>
            <DialogTitle className="text-2xl">{anime.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              <img 
                src={anime.thumbnail_url} 
                alt={anime.title}
                className="w-full rounded-lg"
              />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Описание</h3>
                  <p className="text-sm text-muted-foreground">{anime.description || 'Описание отсутствует'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Жанр:</span> {anime.genre}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Год:</span> {anime.year}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Тип:</span> {anime.type === 'series' ? 'Сериал' : 'Фильм'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Эпизоды:</span> {anime.episodes}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Рейтинг:</span> {anime.rating}/10 ({anime.rating_count} оценок)
                  </div>
                </div>

                {user && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Ваша оценка</h3>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                        <Button
                          key={rating}
                          variant="outline"
                          size="sm"
                          onClick={() => onRate(rating)}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Комментарии ({anime.comments?.length || 0})</h3>
              
              {user ? (
                <div className="mb-4 space-y-2">
                  <Textarea 
                    placeholder="Напишите комментарий..."
                    value={newComment}
                    onChange={(e) => onCommentChange(e.target.value)}
                  />
                  <Button onClick={onAddComment}>
                    <Icon name="Send" size={16} className="mr-2" />
                    Отправить
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">Войдите, чтобы оставить комментарий</p>
              )}

              <div className="space-y-3">
                {anime.comments?.map(comment => (
                  <div key={comment.id} className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium">{comment.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment_text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
