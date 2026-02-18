// src/components/Login.js

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance.post('/api/token/', { username, password })
      .then(response => {
        const { access, refresh } = response.data;
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        login(access);
        navigate('/');
      })
      .catch(error => {
        console.error('Błąd logowania:', error);
        setError('Błędny login lub hasło.');
      });
  };

  return (
    <div className="login-container">
      <h2>Zaloguj się</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Zaloguj się</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p className="switch-link">
        Nie masz konta? <Link to="/register">Zarejestruj się</Link>
      </p>
    </div>
  );
};

export default Login;
