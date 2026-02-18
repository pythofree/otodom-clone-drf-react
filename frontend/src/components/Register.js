// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
    };

    axiosInstance.post('/api/register/', userData)
      .then(() => {

        navigate('/login');
      })
      .catch(error => {
        console.error('Błąd rejestracji:', error);
        if (error.response && error.response.data) {
          const errors = error.response.data;
          const msg = Object.entries(errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
            .join('\n');
          setErrorMsg(msg);
        } else {
          setErrorMsg('Wystąpił błąd podczas rejestracji.');
        }
      });
  };

  return (
    <div className="register-container">
      <h2>Załóż konto</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Adres e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Zarejestruj się</button>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </form>
      <p className="switch-link">
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </div>
  );
};

export default Register;
