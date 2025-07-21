import { MoviesList } from '../features/movies/MoviesList';
import ImportMovies from '../features/movies/ImportMovies';
import React, { useState } from 'react';

const MoviesCatalogPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
    className="container py-5"
    style={{
        minHeight: '100vh',
  backgroundImage: 'url(/images/catalog.jpg)',
  backgroundSize: 'contain',
  backgroundRepeat: 'repeat',
  backgroundPosition: 'center',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    }}
  >
  <div style={{ textAlign: 'center' }}>
  <h1
  className="my-4 text-center"
  style={{
    color: '#1a3c5a',
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  }}
>
  Каталог збережених фільмів
</h1>
</div>


      <div className="d-flex justify-content-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Сховати форму додавання' : 'Додати новий фільм'}
        </button>
      </div>

      <MoviesList showAddForm={showForm} />
      <ImportMovies />
    </div>
  );
};

export default MoviesCatalogPage;
