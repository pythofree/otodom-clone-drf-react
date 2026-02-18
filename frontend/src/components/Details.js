import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import './Details.css';

const Details = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [usdRate, setUsdRate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/api/listings/${id}/`)
      .then(response => setListing(response.data))
      .catch(error => {
        console.error('Błąd ładowania ogłoszenia:', error);
        setError('Nie udało się załadować szczegółów ogłoszenia.');
      });

    axiosInstance.get('/api/exchange-rate/')
      .then(res => setUsdRate(res.data.rate))
      .catch(err => console.error('Błąd ładowania kursu USD:', err));
  }, [id]);

  if (error) return <div className="error-message">{error}</div>;
  if (!listing) return <div className="loading">Ładowanie...</div>;

  return (
    <div className="details-container">
      <h2>{listing.title}</h2>

      {listing.image && (
        <img
          className="details-image"
          src={`http://localhost:8000${listing.image}`}
          alt={listing.title}
        />
      )}

      <div className="details-info">
        <p><strong>Opis:</strong> {listing.description}</p>
        <p><strong>Lokalizacja:</strong> {listing.location}</p>
        <p><strong>Dzielnica:</strong> {listing.district?.name || 'Brak danych'}</p>
        <p><strong>Typ transakcji:</strong> {listing.transaction_type?.name || 'Brak danych'}</p>
        <p><strong>Powierzchnia:</strong> {listing.surface} m²</p>
        <p><strong>Liczba pokoi:</strong> {listing.rooms}</p>
        <p>
          <strong>Cena:</strong> {listing.price} PLN
          {usdRate && (
            <span className="usd"> (~{(listing.price / usdRate).toFixed(2)} USD)</span>
          )}
        </p>
      </div>

      <Link to="/all" className="back-btn">← Powrót do ogłoszeń</Link>
    </div>
  );
};

export default Details;
