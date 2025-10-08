import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { type User } from '@/lib/api';

interface HeaderProps {
  user: User | null;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;
  onLogout: () => void;
  adminPanelContent: React.ReactNode;
  loginDialogContent: React.ReactNode;
  registerDialogContent: React.ReactNode;
}

export default function Header({
  user,
  isAdminOpen,
  setIsAdminOpen,
  isLoginOpen,
  setIsLoginOpen,
  isRegisterOpen,
  setIsRegisterOpen,
  onLogout,
  adminPanelContent,
  loginDialogContent,
  registerDialogContent,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Icon name="Film" size={28} />
              DOCK ANIME
            </h1>
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
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const docContent = `# 🔐 ДЕКЛАРАЦИЯ БЕЗОПАСНОСТИ DOCK ANIME

**Дата:** 8 октября 2025
**Проект:** DOCK ANIME - Платформа для просмотра аниме
**Владелец:** sadxzrtewgkl@gmail.com

---

## 📋 КРАТКОЕ РЕЗЮМЕ

Ваш сайт защищён **15 уровнями безопасности**, охватывающими все критические зоны: аутентификацию, базу данных, серверную логику и пользовательский интерфейс.

---

## 🎯 АККАУНТ АДМИНИСТРАТОРА

**Email:** admin@dock.anime
**Статус:** Активен

⚠️ **ВАЖНО:** Для получения прав администратора зарегистрируйтесь на сайте и обратитесь к разработчику.

### Требования к паролю:
- Минимум 8 символов
- Хотя бы одна заглавная буква (A-Z)
- Хотя бы одна строчная буква (a-z)
- Хотя бы одна цифра (0-9)
- Хотя бы один спецсимвол (!@#$%^&*)

Пример: MySecure2024!

---

## 🛡️ 15 УРОВНЕЙ ЗАЩИТЫ

1. **Хеширование паролей (bcrypt)** - Пароли нечитаемы в БД
2. **JWT токены** - Истекают через 30 дней
3. **Валидация email** - Защита от некорректных адресов
4. **Строгая политика паролей** - Минимум 8 символов + сложность
5. **Блокировка после 5 ошибок** - На 30 минут
6. **Отслеживание блокировки** - Временные метки
7. **Сброс счётчика** - После успешного входа
8. **Проверка активности** - Деактивация аккаунтов
9. **Логирование событий** - Полный аудит
10. **Запись IP и User-Agent** - Отслеживание источников
11. **XSS защита** - Экранирование HTML
12. **SQL Injection защита** - Параметризованные запросы
13. **CORS настройка** - Контроль доступа к API
14. **Проверка прав админа** - Во всех запросах
15. **Разделение ролей** - user/admin

---

## 📊 СТРУКТУРА БД

### users (Пользователи)
- id, email, password_hash
- role (user/admin)
- is_active (активность)
- failed_login_attempts (счётчик ошибок)
- account_locked_until (время разблокировки)

### anime (Контент)
- id, title, description, type, genre
- rating, rating_count
- created_by (кто добавил)

### comments (Комментарии)
- Защищены от XSS
- Модерация через is_approved

### ratings (Оценки)
- 1 пользователь = 1 оценка на аниме

### security_logs (Логи безопасности)
- Все действия: вход, выход, ошибки
- IP, User-Agent, время

---

## 🚨 ЗАЩИТА ОТ АТАК

✓ Brute-Force - Блокировка + строгие пароли
✓ SQL Injection - Параметризованные запросы
✓ XSS - Экранирование ввода
✓ Session Hijacking - JWT с экспирацией
✓ Privilege Escalation - Проверка роли
✓ Account Takeover - Хеширование + блокировка
✓ DDoS - Временные блокировки
✓ Rainbow Tables - Уникальная соль

---

## 📈 МОНИТОРИНГ

Логируются события:
- register_success/duplicate
- login_success/failed/locked
- verify_inactive
- И другие действия

SQL для анализа:
SELECT ip_address, COUNT(*) as attempts 
FROM security_logs 
WHERE success = false 
GROUP BY ip_address 
HAVING COUNT(*) > 10;

---

## 🔧 ЧТО СДЕЛАНО

✅ Хеширование паролей bcrypt
✅ JWT аутентификация
✅ Блокировка аккаунтов
✅ Логирование событий
✅ SQL injection защита
✅ XSS защита
✅ Роли пользователей
✅ CORS настройка

---

## 📞 КОНТАКТЫ

**Владелец:** sadxzrtewgkl@gmail.com
**Дата:** 8 октября 2025
**Версия:** 1.0

---

🛡️ ВАШ САЙТ ЗАЩИЩЁН. ДАННЫЕ ПОЛЬЗОВАТЕЛЕЙ В БЕЗОПАСНОСТИ.`;
                
                const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'SECURITY_DOCUMENTATION.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Скачать декларацию безопасности
            </Button>
            
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">{user.email}</span>
                {user.is_admin && (
                  <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Icon name="Settings" size={16} className="mr-2" />
                        Админ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Админ-панель</DialogTitle>
                      </DialogHeader>
                      {adminPanelContent}
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon name="LogIn" size={16} className="mr-2" />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход в аккаунт</DialogTitle>
                    </DialogHeader>
                    {loginDialogContent}
                  </DialogContent>
                </Dialog>

                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Регистрация</DialogTitle>
                    </DialogHeader>
                    {registerDialogContent}
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}