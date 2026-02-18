import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import './EditListing.css';

const EditListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    axiosInstance.get(`/api/listings/${id}/`)
      .then(res => {
        const data = res.data;
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          surface: data.surface || '',
          rooms: data.rooms || '',
          transaction_type_id: data.transaction_type?.id || '',
          district_id: data.district?.id || '',
        });
      })
      .catch(() => setError('Nie udało się załadować ogłoszenia.'));

    axiosInstance.get('/api/transaction-types/')
      .then(res => setTransactionTypes(res.data))
      .catch(() => {});

    axiosInstance.get('/api/districts/')
      .then(res => setDistricts(res.data))
      .catch(() => {});
  }, [id]);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      updatedData.append(key, value);
    });

    if (image) updatedData.append('image', image);

    axiosInstance.put(`/api/listings/${id}/`, updatedData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        alert('Ogłoszenie zostało zaktualizowane!');
        navigate('/my');
      })
      .catch(() => {
        setError('Wystąpił błąd podczas zapisywania zmian.');
      });
  };

  return (
    <div className="edit-listing-container">
      <h2>Edytuj ogłoszenie</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="edit-listing-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Tytuł"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Opis"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Cena"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Lokalizacja"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="surface"
          placeholder="Powierzchnia (m²)"
          value={formData.surface}
          onChange={handleChange}
        />
        <input
          type="number"
          name="rooms"
          placeholder="Liczba pokoi"
          value={formData.rooms}
          onChange={handleChange}
        />

        <select
          name="transaction_type_id"
          value={formData.transaction_type_id}
          onChange={handleChange}
          required
        >
          <option value="">Wybierz typ transakcji</option>
          {transactionTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <select
          name="district_id"
          value={formData.district_id}
          onChange={handleChange}
          required
        >
          <option value="">Wybierz dzielnicę</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Zapisz zmiany</button>
      </form>
    </div>
  );
};

export default EditListing;
