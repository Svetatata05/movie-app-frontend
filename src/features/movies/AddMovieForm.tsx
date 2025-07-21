import React, { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addMovie, fetchMovies } from './moviesSlice';
import { useNavigate } from 'react-router-dom';

const FORMATS = ['VHS', 'DVD', 'Blu-Ray'] as const;

export const AddMovieForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState<typeof FORMATS[number]>(FORMATS[0]);
  const [actors, setActors] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); 

  // Оголошуємо currentYear тут, щоб мати доступ і в JSX, і в handleSubmit
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
  
    if (!title.trim()) return setError('Вкажіть назву фільму');
    if (!year || isNaN(yearNum) || yearNum < 1888 || yearNum > currentYear)
      return setError(`Рік має бути в межах 1888–${currentYear}`);
    if (!FORMATS.includes(format)) return setError('Оберіть коректний формат');
    if (!actors.trim()) return setError('Вкажіть акторів');
  
    setError('');
    const actorsList = actors
      .split(/\r?\n|,/)
      .map((a) => a.trim())
      .filter(Boolean);
  
    try {
      // Тут додаємо ще додаткову перевірку перед диспатчем (на всяк випадок)
      if (yearNum < 1888 || yearNum > currentYear) {
        return setError(`Рік має бути в межах 1888–${currentYear}`);
      }
  
      await dispatch(addMovie({
        title: title.trim(),
        year: yearNum,
        format,
        actors: actorsList,
      })).unwrap();

      await dispatch(fetchMovies());
      
      setTitle('');
      setYear('');
      setFormat(FORMATS[0]);
      setActors('');
      setSuccess(true);
    } catch (err: any) {
      if (typeof err === 'string') {
        setError(err);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Невідома помилка');
      }  }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">🎬 Додати новий фільм</h3>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          {success ? (
            <div className="alert alert-success text-center">
              ✅ Фільм успішно додано!
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button onClick={() => setSuccess(false)} className="btn btn-sm btn-light">
                  Додати ще фільм
                </button>
                <button
                  onClick={() => {
                    dispatch(fetchMovies()).then(() => navigate('/catalog'));
                  }}
                  className="btn btn-sm btn-success"
                >
                  Переглянути каталог →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Назва фільму</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введіть назву"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="year" className="form-label">Рік випуску</label>
                <input
                  type="number"
                  className="form-control"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Наприклад: 2005"
                  min={1888}
                  max={currentYear}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="format" className="form-label">Формат</label>
                <select
                  id="format"
                  className="form-select"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as typeof FORMATS[number])}
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="actors" className="form-label">Актори (через кому або з нового рядка)</label>
                <textarea
                  id="actors"
                  className="form-control"
                  value={actors}
                  onChange={(e) => setActors(e.target.value)}
                  rows={3}
                  placeholder="Том Хенкс, Меріл Стріп"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">Додати фільм</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
