import React from 'react';
import { Movie } from './types';

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <div className="card mb-3" style={{ height: '100%' }}>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{movie.title}</h5>
        <p className="card-text">
          <strong>Рік:</strong> {movie.year} <br />
          <strong>Формат:</strong> {movie.format} <br />
          <strong>Актори:</strong>{' '}
{Array.isArray(movie.actors)
  ? movie.actors.join(', ')
  : typeof movie.actors === 'string'
  ? movie.actors
  : 'Немає даних'}

        </p>
      </div>
    </div>
  );
};

export default MovieCard;
