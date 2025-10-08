import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api, type User } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const { toast } = useToast();

  const verifyAuth = async () => {
    try {
      const userData = await api.auth.verify();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  const handleLogin = async () => {
    try {
      const { token, user: userData } = await api.auth.login(loginEmail, loginPassword);
      localStorage.setItem('auth_token', token);
      setUser(userData);
      toast({ title: 'Успешный вход', description: `Добро пожаловать, ${userData.email}!` });
      return true;
    } catch (error: any) {
      toast({ title: 'Ошибка входа', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const handleRegister = async () => {
    try {
      const { token, user: userData } = await api.auth.register(loginEmail, loginPassword);
      localStorage.setItem('auth_token', token);
      setUser(userData);
      toast({ title: 'Регистрация успешна', description: 'Добро пожаловать!' });
      return true;
    } catch (error: any) {
      toast({ title: 'Ошибка регистрации', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast({ title: 'Выход выполнен' });
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await api.password.change(oldPassword, newPassword);
      toast({ title: 'Успех', description: 'Пароль успешно изменён!' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  return {
    user,
    loginEmail,
    loginPassword,
    setLoginEmail,
    setLoginPassword,
    verifyAuth,
    handleLogin,
    handleRegister,
    handleLogout,
    handleChangePassword,
  };
}
