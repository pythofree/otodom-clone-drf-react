// src/components/MyListings.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Link } from 'react-router-dom';
import './MyListings.css';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [usdRate, setUsdRate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get('/api/my_listings/')
      .then(response => {
        setListings(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Błąd podczas ładowania ogłoszeń:', error);
        setError('Błąd podczas ładowania danych.');
      });

    axiosInstance.get('/api/exchange-rate/')
      .then(res => setUsdRate(res.data.rate))
      .catch(err => console.error('Błąd ładowania kursu USD:', err));
  }, []);

  const handleDelete = (id) => {
    axiosInstance.delete(`/api/listings/${id}/`)
      .then(() => {
        setListings(listings.filter(listing => listing.id !== id));
        alert('Reklama została usunięta.');
      })
      .catch(error => {
        console.error('Błąd usuwania:', error);
        alert('Błąd podczas usuwania reklamy');
      });
  };

  const handlePay = (listing) => {
    const payload = {
      title: listing.title,
      amount: listing.price * 100,
      currency: 'PLN'
    };

    axiosInstance.post('/api/pay/', payload)
      .then(response => {
        const redirectUrl = response.data.redirectUri;
        window.open(redirectUrl, '_blank');
      })
      .catch(error => {
        console.error('Błąd płatności:', error);
        alert('Nie udało się rozpocząć płatności.');
      });
  };

  return (
    <div className="my-listings-container">
      <h2 className="section-title">Moje ogłoszenia</h2>
      {error && <p className="error-message">{error}</p>}

      {listings.length === 0 ? (
        <p className="no-listings">Nie dodałeś żadnych ogłoszeń.</p>
      ) : (
        <div className="listings-grid">
          {listings.map(listing => (
            <div className="listing-card" key={listing.id}>
              {listing.image && (
                <img
                  className="listing-image"
                  src={`http://localhost:8000${listing.image}`}
                  alt={listing.title}
                />
              )}
              <div className="listing-content">
                <h3>{listing.title}</h3>
                <p className="price">
                  {listing.price} PLN
                  {usdRate && (
                    <span className="usd"> (~{(listing.price / usdRate).toFixed(2)} USD)</span>
                  )}
                </p>
                <p className="location">📍 {listing.location}</p>
                <p className="description">{listing.description}</p>

                <div className="button-group">
                  <button className="delete-btn" onClick={() => handleDelete(listing.id)}>🗑️ Usuń</button>
                  <Link to={`/edit/${listing.id}`}>
                    <button className="edit-btn">✏️ Edytuj</button>
                  </Link>
                  <button className="pay-btn" onClick={() => handlePay(listing)}>💳 Zapłać</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
