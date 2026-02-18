import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // исправили имя файла
import { Link } from 'react-router-dom';

function getUsernameFromToken() {
  const token = localStorage.getItem('access');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username;
  } catch (e) {
    return null;
  }
}

function ListingList() {
  const [listings, setListings] = useState([]);
  const currentUser = getUsernameFromToken();

  const fetchListings = () => {
    axiosInstance.get('/api/listings/')
      .then((res) => setListings(res.data))
      .catch((err) => console.error('Błąd ładowania:', err));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/listings/${id}/`);
      fetchListings(); // обновление после удаления
    } catch (err) {
      console.error('Błąd usuwania:', err.response?.data || err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🏡 <strong>Список объявлений</strong></h1>

      {listings.map((listing) => (
        <div
          key={listing.id}
          style={{
            border: '1px solid #ccc',
            margin: '20px 0',
            padding: '10px',
            borderRadius: '10px'
          }}
        >
          <h2>{listing.title}</h2>

          {listing.image && (
            <img
              src={`http://localhost:8000${listing.image}`}
              alt="Zdjęcie"
              style={{ width: '300px', borderRadius: '8px', marginBottom: '10px' }}
            />
          )}

          <p><strong>Lokalizacja:</strong> {listing.location}</p>
          <p><strong>Cena:</strong> {Number(listing.price).toFixed(2)} PLN</p>
          <p>{listing.description}</p>
          <p><em>Autor: {listing.owner}</em></p>

          {String(listing.owner).trim() === String(currentUser).trim() && (
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => handleDelete(listing.id)}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Удалить
              </button>

              <Link
                to={`/edit/${listing.id}`}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  textDecoration: 'none'
                }}
              >
                ✏️ Редактировать
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ListingList;
