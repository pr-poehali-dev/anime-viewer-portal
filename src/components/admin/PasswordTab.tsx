import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface PasswordTabProps {
  onChangePassword: (oldPassword: string, newPassword: string) => void;
}

export default function PasswordTab({ onChangePassword }: PasswordTabProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    if (newPassword.length < 8) {
      alert('Пароль должен содержать минимум 8 символов');
      return;
    }
    onChangePassword(oldPassword, newPassword);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Старый пароль</label>
        <Input 
          type="password"
          placeholder="Введите старый пароль" 
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Новый пароль</label>
        <Input 
          type="password"
          placeholder="Минимум 8 символов, буквы, цифры, спецсимволы" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Требования: минимум 8 символов, заглавная буква, строчная буква, цифра, спецсимвол
        </p>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Подтвердите новый пароль</label>
        <Input 
          type="password"
          placeholder="Повторите новый пароль" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button 
        className="w-full" 
        onClick={handleSubmit}
        disabled={!oldPassword || !newPassword || !confirmPassword}
      >
        <Icon name="Key" size={16} className="mr-2" />
        Изменить пароль
      </Button>
    </div>
  );
}
