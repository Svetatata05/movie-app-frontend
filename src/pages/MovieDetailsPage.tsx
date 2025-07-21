import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useAppDispatch } from '../app/hooks';
import { fetchMovies } from '../features/movies/moviesSlice';
import { Movie } from '../features/movies/types';

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const movies = useSelector((state: RootState) => state.movies.movies);
  const loading = useSelector((state: RootState) => state.movies.loading);

  useEffect(() => {
    if (movies.length === 0 && !loading) {
      dispatch(fetchMovies());
    }
  }, [movies.length, loading, dispatch]);

  const movie = movies.find((m: Movie) => m.id === Number(id)); // Ось тут Number(id)

  if (!movie && loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Завантаження...</span>
        </div>
      </div>
    );
  }

  if (!movie && !loading) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">⚠️ Фільм не знайдено</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          ← Назад
        </button>
      </div>
    );
  }

  if (!movie) return null; // для TypeScript

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="card shadow p-4">
        <h2 className="mb-3">{movie.title}</h2>
        <p><strong>Рік випуску:</strong> {movie.year}</p>
        <p><strong>Формат:</strong> {movie.format}</p>

        <div>
          <strong>Актори:</strong>
          <ul className="mt-2">
            {movie.actors.map((actor, index) => (
              <li key={index}>{actor}</li>
            ))}
          </ul>
        </div>

        <hr className="my-4" />

        <p><strong>Короткий опис:</strong> Один із найпопулярніших фільмів у своєму жанрі. Обов’язковий до перегляду для поціновувачів класики.</p>
        <p><strong>Рейтинг IMDb:</strong> {Math.floor(Math.random() * 3) + 7}.{Math.floor(Math.random() * 10)}</p>
        <p><strong>Кількість лайків:</strong> {Math.floor(Math.random() * 1000)}</p>
      </div>
    </div>
  );
};

export default MoviePage;
