import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <h1 style={{ color: 'green' }}>✅ Płatność zakończona</h1>
      <p>Dziękujemy za zakup! Twoje ogłoszenie zostało opłacone.</p>
      <Link to="/">
        <button style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Powrót na stronę główną
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;
