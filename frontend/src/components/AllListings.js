// src/components/AllListings.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './AllListings.css';
import { Link } from 'react-router-dom';

const AllListings = () => {
  const [listings, setListings] = useState([]);
  const [usdRate, setUsdRate] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState(null);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [districts, setDistricts] = useState([]);

  const initialFilters = {
    location: '',
    priceMin: '',
    priceMax: '',
    transaction_type_id: '',
    district_id: '',
    surfaceMin: '',
    surfaceMax: '',
    rooms: '',
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axiosInstance.get('/api/listings/')
      .then(response => {
        setListings(response.data);
        setError(null);
      })
      .catch(() => setError('Nie udało się załadować ogłoszeń.'));

    axiosInstance.get('/api/exchange-rate/')
      .then(res => setUsdRate(res.data.rate))
      .catch(() => {});

    axiosInstance.get('/api/transaction-types/')
      .then(res => setTransactionTypes(res.data))
      .catch(() => {});

    axiosInstance.get('/api/districts/')
      .then(res => setDistricts(res.data))
      .catch(() => {});
  };

  const handleFilter = (e) => {
    e.preventDefault();

    axiosInstance.get('/api/listings/', {
      params: {
        location: filters.location,
        price_min: filters.priceMin,
        price_max: filters.priceMax,
        transaction_type_id: filters.transaction_type_id,
        district_id: filters.district_id,
        surface_min: filters.surfaceMin,
        surface_max: filters.surfaceMax,
        rooms: filters.rooms,
      },
    })
      .then(response => {
        setListings(response.data);
        setError(null);
      })
      .catch(() => setError('Nie udało się załadować ogłoszeń.'));
  };

  const handleClear = () => {
    setFilters(initialFilters);
    fetchData();
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="listings-container">
      <form className="filter-form" onSubmit={handleFilter}>
        <select
          value={filters.transaction_type_id}
          onChange={(e) => setFilters({ ...filters, transaction_type_id: e.target.value })}
        >
          <option value="">Typ transakcji</option>
          {transactionTypes.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select
          value={filters.district_id}
          onChange={(e) => setFilters({ ...filters, district_id: e.target.value })}
        >
          <option value="">Dzielnica</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <div className="range-group">
          <input
            type="number"
            placeholder="Cena od"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cena do"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
          />
        </div>

        <div className="range-group">
          <input
            type="number"
            placeholder="Pow. od"
            value={filters.surfaceMin}
            onChange={(e) => setFilters({ ...filters, surfaceMin: e.target.value })}
          />
          <input
            type="number"
            placeholder="Pow. do"
            value={filters.surfaceMax}
            onChange={(e) => setFilters({ ...filters, surfaceMax: e.target.value })}
          />
        </div>

        <input
          type="number"
          placeholder="Liczba pokoi"
          value={filters.rooms}
          onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
        />

        <div className="button-group">
          <button type="submit">Wyszukaj</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Wyczyść</button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}

      {listings.length === 0 ? (
        <p>Brak dostępnych ogłoszeń.</p>
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
                {listing.transaction_type && (
                  <p><strong>Typ transakcji:</strong> {listing.transaction_type.name}</p>
                )}
                {listing.district && (
                  <p><strong>Dzielnica:</strong> {listing.district.name}</p>
                )}
                <p><strong>Powierzchnia:</strong> {listing.surface} m²</p>
                <p><strong>Liczba pokoi:</strong> {listing.rooms}</p>
                <p className="description">
                  {expanded[listing.id]
                    ? listing.description
                    : listing.description.slice(0, 100) + (listing.description.length > 100 ? '...' : '')}
                </p>
                {listing.description.length > 100 && (
                  <button className="expand-btn" onClick={() => toggleExpand(listing.id)}>
                    {expanded[listing.id] ? 'Pokaż mniej' : 'Czytaj więcej'}
                  </button>
                )}
                <Link to={`/details/${listing.id}`} className="details-btn">
                  Zobacz szczegóły
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllListings;
