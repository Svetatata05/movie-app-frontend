import React from 'react';
import { Movie } from './types';

interface MovieDetailsProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '1rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: '#888',
          }}
          aria-label="Закрити"
        >
          ✖
        </button>

        <h2 style={{ marginBottom: '1rem' }}>{movie.title}</h2>
        <p><strong>Рік випуску:</strong> {movie.year}</p>
        <p><strong>Формат:</strong> {movie.format}</p>

        <div>
          <strong>Актори:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
            {movie.actors.map((actor, i) => (
              <li key={i}>{actor}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
