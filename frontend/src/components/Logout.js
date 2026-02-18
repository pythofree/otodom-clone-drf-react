import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    // Можно также полностью очистить всё
    // localStorage.clear();

    navigate('/login'); // Перенаправляем пользователя на страницу входа
  };

  return (
    <div>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Logout;
