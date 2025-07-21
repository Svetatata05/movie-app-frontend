import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMovies, deleteMovie } from './moviesSlice';
import { selectMovies } from './selectors';
import { AddMovieForm } from './AddMovieForm';
import { v4 as uuidv4 } from 'uuid';
import MovieCard from './MovieCard';
import { useNavigate } from 'react-router-dom';

interface MoviesListProps {
  showAddForm?: boolean;
}

export const MoviesList: React.FC<MoviesListProps> = ({ showAddForm = true }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const movies = useAppSelector(selectMovies);
  const loading = useAppSelector((state) => state.movies.loading);
  const error = useAppSelector((state) => state.movies.error);

  const [searchTerm, setSearchTerm] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [movies.length, searchTerm]);

  const filteredMovies = movies.filter((movie) => {
    const term = searchTerm.trim().toLowerCase();
    const yearNum = parseInt(term);
  
    return (
      movie.title.toLowerCase().includes(term) ||
      movie.actors.some((actor) => actor.toLowerCase().includes(term)) ||
      (!isNaN(yearNum) && movie.year === yearNum)
    );
  });
  

  const sortedMovies = [...filteredMovies].sort((a, b) =>
    a.title.localeCompare(b.title, 'uk', { sensitivity: 'base' })
  );

  return (
    <div
  className="movies-container"
  style={{
    maxWidth: 1100,
    margin: '1rem auto',
    background: 'linear-gradient(135deg, rgba(214, 225, 237, 0.7) 0%, rgba(162, 240, 208, 0.7) 100%)',
    borderRadius: 12,
    padding: '1rem 3rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  }}
>

      {showAddForm && (
        <div className="mb-4">
          <AddMovieForm />
        </div>
      )}

      <div className="mb-4">
        <input
          type="search"
          className="form-control"
          placeholder="Пошук за назвою, актором або роком"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && (
        <div className="alert alert-info text-center" role="alert">
          Завантаження...
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-start" style={{ gap: '24px' }}>
        {sortedMovies.length === 0 && !loading && (
          <div className="text-center text-muted" style={{ width: '100%' }}>
            Фільми не знайдені
          </div>
        )}

        {sortedMovies.map((movie, index) => {
          const key = movie.id ?? uuidv4();
          return (
            <div
              key={key}
              className={`movie-card ${loaded ? 'fade-in' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <MovieCard movie={movie} />
              <div
                className="movie-card-footer"
                style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
              >
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => dispatch(deleteMovie(movie.id ?? ''))}
                  title="Видалити фільм"
                >
                  Видалити
                </button>
                <button
                  className="btn btn-primary btn-sm btn-details"
                  title="Детальніше"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                   Детальніше
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .movie-card {
          position: relative;
          flex: 0 1 calc(33.333% - 16px);
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.3s ease;
          cursor: default;
          border-radius: 8px;
          background: #ffffffcc;
          padding: 1rem;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          height: 360px;
          display: flex;
          flex-direction: column;
        }
        .movie-card.fade-in {
          opacity: 1;
          transform: translateY(0);
        }
        .movie-card:hover {
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
        .movie-card-footer {
          margin-top: 1rem;
        }

        /* Кнопка "Детальніше" з додатковою анімацією */
        .btn-details {
          background: linear-gradient(45deg,rgb(168, 184, 211), #2563eb);
          border: none;
          color: white;
          font-weight: 600;
          transition: background 0.3s ease;
        }
        .btn-details:hover {
          background: linear-gradient(45deg, #2563eb,rgb(39, 70, 154));
        }

        /* Кнопка "Видалити" з контуром */
        .btn-outline-danger {
          border-width: 2px;
          font-weight: 600;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .btn-outline-danger:hover {
          background-color: #dc2626;
          color: white;
          border-color: #dc2626;
        }

        @media (max-width: 992px) {
          .movie-card {
            flex: 0 1 calc(50% - 16px);
            height: 340px;
          }
        }
        @media (max-width: 576px) {
          .movie-card {
            flex: 0 1 100%;
            height: auto;
          }
          .movie-card-footer {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};
