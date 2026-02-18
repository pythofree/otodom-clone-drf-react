// src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Home from './components/Home';
import AllListings from './components/AllListings';
import MyListings from './components/MyListings';
import AddListing from './components/AddListing';
import Register from './components/Register';
import Login from './components/Login';
import EditListing from './components/EditListing';
import PaymentSuccess from './components/PaymentSuccess';
import Details from './components/Details';

import './App.css';

const App = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        {/* Шапка */}
        <header className="App-header">
          <div className="header-content">
            <div className="branding">
              <h1>FlatFinder</h1>
            </div>
            <nav className="navbar">
              <ul className="nav-links">
                <li><Link to="/">Dom</Link></li>
                <li><Link to="/all">Wszystkie ogłoszenia</Link></li>
                {isAuthenticated ? (
                  <>
                    <li><Link to="/my">Moje ogłoszenia</Link></li>
                    <li><Link to="/add">Dodaj ogłoszenie</Link></li>
                    <li>
      <a
        href="http://localhost:8000/admin/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Admin
      </a>
    </li>
                    <li><button onClick={logout}>Wyloguj się</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Rejestracja</Link></li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>

        {/* Контент */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all" element={<AllListings />} />
            <Route path="/my" element={isAuthenticated ? <MyListings /> : <Login />} />
            <Route path="/add" element={isAuthenticated ? <AddListing /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit/:id" element={isAuthenticated ? <EditListing /> : <Login />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </main>

        {/* Подвал */}
        <footer className="App-footer">
          <p>&copy; {new Date().getFullYear()} FlatFinder. Wszystkie prawa zastrzeżone.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
