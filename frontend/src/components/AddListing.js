import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import './AddListing.css';

const AddListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    surface: '',
    rooms: '',
    transaction_type_id: '',
    district_id: '',
  });

  const [image, setImage] = useState(null);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) navigate('/login');

    axiosInstance.get('/api/transaction-types/')
      .then(res => setTransactionTypes(res.data))
      .catch(() => {});

    axiosInstance.get('/api/districts/')
      .then(res => setDistricts(res.data))
      .catch(() => {});
  }, [navigate]);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      finalData.append(key, value);
    });

    if (image) finalData.append('image', image);

    axiosInstance.post('/api/listings/', finalData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        alert('Ogłoszenie zostało dodane!');
        navigate('/my');
      })
      .catch(error => {
        if (error.response?.data) {
          const errors = Object.entries(error.response.data)
            .map(([k, v]) => `${k}: ${v.join(', ')}`)
            .join('\n');
          setError(errors);
        } else {
          setError('Wystąpił błąd połączenia z serwerem.');
        }
      });
  };

  return (
    <div className="add-listing-container">
      <h2>Dodaj ogłoszenie</h2>
      <form className="add-listing-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Tytuł" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Opis" value={formData.description} onChange={handleChange} required />

        <input type="number" name="price" placeholder="Cena (PLN)" value={formData.price} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Adres / okolica" value={formData.location} onChange={handleChange} required />

        <input type="number" name="surface" placeholder="Powierzchnia (m²)" value={formData.surface} onChange={handleChange} required />
        <input type="number" name="rooms" placeholder="Liczba pokoi" value={formData.rooms} onChange={handleChange} required />

        <select name="transaction_type_id" value={formData.transaction_type_id} onChange={handleChange} required>
          <option value="">Wybierz typ transakcji</option>
          {transactionTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <select name="district_id" value={formData.district_id} onChange={handleChange} required>
          <option value="">Wybierz dzielnicę</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Zapisz ogłoszenie</button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddListing;
