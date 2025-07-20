import React, { useState, useRef } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addMovie, fetchMovies } from './moviesSlice';
import './ImportMovies.css';

const ImportMovies: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const parseFileContent = (text: string) => {
    const entries = text
      .trim()
      .replace(/\r/g, '')
      .split(/\n{2,}/); // 2+ new lines = new movie
  
    return entries.map(entry => {
      const lines = entry.split('\n');
      const movie: any = {};
  
      lines.forEach(line => {
        const [key, ...rest] = line.split(':');
        if (!key || rest.length === 0) return;
  
        const value = rest.join(':').trim();
        const keyLower = key.trim().toLowerCase();
  
        switch (keyLower) {
          case 'title':
          case 'назва':
            movie.title = value;
            break;
          case 'release year':
          case 'рік':
            movie.year = Number(value);
            break;
          case 'format':
          case 'формат':
            const format = value.toLowerCase();
            if (format === 'vhs') movie.format = 'VHS';
            else if (format === 'dvd') movie.format = 'DVD';
            else if (format === 'blu-ray' || format === 'bluray') movie.format = 'Blu-Ray';
            else movie.format = value;
            break;
          case 'stars':
          case 'актори':
            const actors = value
              .split(',')
              .map(actor =>
                actor
                  .replace(/[\u200B-\u200D\uFEFF\u00A0\t]/g, '') // remove invisible chars
                  .trim()
              )
              .filter(Boolean);
  
            if (!actors.length) {
              console.warn(`⚠️ No actors found for movie "${movie.title || 'no title'}". Raw line:`, value);
            }
  
            movie.actors = actors;
            break;
        }
      });

      return movie;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const text = reader.result as string;
        const movies = parseFileContent(text);

        console.log('🎬 Імпортовані фільми:', movies);

        for (const movie of movies) {
          if (
            movie.title &&
            movie.year &&
            movie.format &&
            Array.isArray(movie.actors) &&
            movie.actors.length > 0
          ) {
            try {
              await dispatch(addMovie(movie)).unwrap();
            } catch (err: any) {
              let message = 'Помилка при додаванні фільму';
              if (typeof err === 'string') {
                message = err;
              } else if (err?.includes?.('already exists') || err?.includes?.('існує')) {
                message = `Фільм "${movie.title}" вже існує`;
              }

              console.error(`❌ Помилка при додаванні фільму: ${movie.title}`, err);
              setError(message);
            }
          } else {
            console.warn('⏭️ Пропущено некоректний запис:', movie);
          }
        }

        // Оновлюємо список фільмів після імпорту, щоб відразу показати нові дані
        await dispatch(fetchMovies());

      } catch (err) {
        console.error('❌ Помилка парсингу:', err);
        setError('Помилка при парсингу файлу');
      }
    };

    reader.onerror = () => {
      setError('Не вдалось прочитати файл');
    };

    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="import-container">
      <input
        type="file"
        accept=".txt"
        ref={fileInputRef}
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <button className="import-button" onClick={handleButtonClick}>
        Імпортувати фільми
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ImportMovies;
