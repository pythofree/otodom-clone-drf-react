// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero section */}
      <section className="hero">
        <h1>Znajdź idealne mieszkanie szybciej niż myślisz</h1>
        <p>FlatFinder to prosta, darmowa i nowoczesna platforma ogłoszeń nieruchomości</p>
      </section>

      {/* Advantages */}
      <section className="advantages">
        <div className="adv-card">
          <span>💸</span>
          <h3>Darmowe ogłoszenia</h3>
          <p>Dodawaj oferty całkowicie za darmo — bez prowizji i ukrytych kosztów</p>
        </div>
        <div className="adv-card">
          <span>🛒</span>
          <h3>Płatność online</h3>
          <p>Bezpieczna i szybka płatność przez system wewnętrzny — jak na prawdziwej platformie</p>
        </div>
        <div className="adv-card">
          <span>🧩</span>
          <h3>Łatwa obsługa</h3>
          <p>Panel użytkownika pozwala Ci edytować, usuwać i zarządzać ogłoszeniami w 1 klik</p>
        </div>
      </section>

      {/* CTA buttons */}
      <section className="cta">
        <Link to="/all" className="cta-btn">📍 Przeglądaj ogłoszenia</Link>
        <Link to="/add" className="cta-btn">📝 Dodaj ogłoszenie</Link>
        <Link to="/login" className="cta-btn">🔑 Zaloguj się</Link>
      </section>

      {/* FAQ section */}
      <section className="faq">
        <h2>Najczęściej zadawane pytania</h2>
        <div className="faq-item">
          <h4>❓ Czy ogłoszenia są płatne?</h4>
          <p>Nie! Możesz dodawać ogłoszenia całkowicie za darmo.</p>
        </div>
        <div className="faq-item">
          <h4>❓ Czy mogę edytować lub usunąć ogłoszenie?</h4>
          <p>Tak, po zalogowaniu możesz edytować lub usuwać swoje ogłoszenia.</p>
        </div>
        <div className="faq-item">
          <h4>❓ Czy muszę się rejestrować, by przeglądać oferty?</h4>
          <p>Nie, przeglądanie ogłoszeń jest dostępne dla każdego. Konto jest potrzebne tylko do dodawania i zarządzania ogłoszeniami.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
