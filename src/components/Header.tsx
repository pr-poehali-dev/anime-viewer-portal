import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { type User } from '@/lib/api';
import { useState } from 'react';

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
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const securityDocumentation = `# 🔐 ДЕКЛАРАЦИЯ БЕЗОПАСНОСТИ DOCK ANIME

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

  const downloadSecurityDoc = () => {
    const blob = new Blob([securityDocumentation], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SECURITY_DOCUMENTATION.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <div className="flex items-center gap-2 md:gap-3">
            {/* Мобильное меню-бургер */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>

            <Dialog open={isSecurityOpen} onOpenChange={setIsSecurityOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Icon name="Shield" size={16} className="mr-2" />
                  <span className="hidden lg:inline">Безопасность</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon name="Shield" size={24} />
                    Декларация безопасности DOCK ANIME
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="bg-muted p-4 rounded-lg">
                    <p><strong>Дата:</strong> 8 октября 2025</p>
                    <p><strong>Проект:</strong> DOCK ANIME - Платформа для просмотра аниме</p>
                    <p><strong>Владелец:</strong> sadxzrtewgkl@gmail.com</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Icon name="FileText" size={18} />
                      Краткое резюме
                    </h3>
                    <p>Ваш сайт защищён <strong>15 уровнями безопасности</strong>, охватывающими все критические зоны: аутентификацию, базу данных, серверную логику и пользовательский интерфейс.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Icon name="UserCheck" size={18} />
                      Аккаунт администратора
                    </h3>
                    <p><strong>Email:</strong> admin@dock.anime</p>
                    <p><strong>Статус:</strong> Активен</p>
                    <p className="text-yellow-600 dark:text-yellow-400 mt-2">⚠️ <strong>ВАЖНО:</strong> Для получения прав администратора зарегистрируйтесь на сайте и обратитесь к разработчику.</p>
                    <div className="mt-2">
                      <p className="font-semibold">Требования к паролю:</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>Минимум 8 символов</li>
                        <li>Хотя бы одна заглавная буква (A-Z)</li>
                        <li>Хотя бы одна строчная буква (a-z)</li>
                        <li>Хотя бы одна цифра (0-9)</li>
                        <li>Хотя бы один спецсимвол (!@#$%^&*)</li>
                      </ul>
                      <p className="mt-1 text-muted-foreground">Пример: MySecure2024!</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Icon name="ShieldCheck" size={18} />
                      15 уровней защиты
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Хеширование паролей (bcrypt)</strong> - Пароли нечитаемы в БД</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>JWT токены</strong> - Истекают через 30 дней</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Валидация email</strong> - Защита от некорректных адресов</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Строгая политика паролей</strong> - Минимум 8 символов + сложность</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Блокировка после 5 ошибок</strong> - На 30 минут</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Отслеживание блокировки</strong> - Временные метки</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Сброс счётчика</strong> - После успешного входа</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Проверка активности</strong> - Деактивация аккаунтов</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Логирование событий</strong> - Полный аудит</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Запись IP и User-Agent</strong> - Отслеживание источников</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>XSS защита</strong> - Экранирование HTML</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>SQL Injection защита</strong> - Параметризованные запросы</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>CORS настройка</strong> - Контроль доступа к API</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Проверка прав админа</strong> - Во всех запросах</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Разделение ролей</strong> - user/admin</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Database" size={18} />
                      Структура базы данных
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded">
                        <p className="font-semibold">users (Пользователи)</p>
                        <p className="text-xs text-muted-foreground">id, email, password_hash, role (user/admin), is_active, failed_login_attempts, account_locked_until</p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-semibold">anime (Контент)</p>
                        <p className="text-xs text-muted-foreground">id, title, description, type, genre, rating, rating_count, created_by</p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-semibold">comments (Комментарии)</p>
                        <p className="text-xs text-muted-foreground">Защищены от XSS, модерация через is_approved</p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-semibold">ratings (Оценки)</p>
                        <p className="text-xs text-muted-foreground">1 пользователь = 1 оценка на аниме</p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-semibold">security_logs (Логи безопасности)</p>
                        <p className="text-xs text-muted-foreground">Все действия: вход, выход, ошибки, IP, User-Agent, время</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Icon name="ShieldAlert" size={18} />
                      Защита от атак
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-xs">Brute-Force</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-xs">SQL Injection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-xs">XSS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-xs">Session Hijacking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-xs">Privilege Escalation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-xs">Account Takeover</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-xs">DDoS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-green-600" />
                        <span className="text-xs">Rainbow Tables</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-center">
                    <p className="text-green-700 dark:text-green-300 font-semibold flex items-center justify-center gap-2">
                      <Icon name="ShieldCheck" size={20} />
                      ВАШ САЙТ ЗАЩИЩЁН. ДАННЫЕ ПОЛЬЗОВАТЕЛЕЙ В БЕЗОПАСНОСТИ.
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={downloadSecurityDoc}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать полную декларацию безопасности
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline truncate max-w-[120px]">{user.email}</span>
                {user.is_admin && (
                  <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Icon name="Settings" size={16} className="sm:mr-2" />
                        <span className="hidden sm:inline">Админ</span>
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
                  <Icon name="LogOut" size={16} className="sm:mr-2" />
                  <span className="hidden sm:inline">Выйти</span>
                </Button>
              </>
            ) : (
              <>
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon name="LogIn" size={16} className="sm:mr-2" />
                      <span className="hidden sm:inline">Войти</span>
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

        {/* Мобильное выдвижное меню */}
        {isMobileMenuOpen && (
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
                onClick={() => setIsSecurityOpen(true)}
                className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors active:bg-muted/80 text-left"
              >
                🛡️ Безопасность
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}