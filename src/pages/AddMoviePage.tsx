import React from 'react';
import { AddMovieForm } from 'features/movies/AddMovieForm';
import ImportMovies from 'features/movies/ImportMovies';

const backgroundImageUrl = '/images/film1.jpg'
const AddMoviePage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '3rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)', // напівпрозорий білий фон
          borderRadius: 12,
          padding: '2rem 2.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: '#222' }}>
          Додати новий фільм до колекції в декілька кліків
        </h2>

        <AddMovieForm />

        <div style={{ marginTop: '2rem' }}>
          <ImportMovies />
        </div>
      </div>
    </div>
  );
};

export default AddMoviePage;
