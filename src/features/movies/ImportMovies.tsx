import React, { useState, useRef } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addMovie, fetchMovies } from './moviesSlice';
import './ImportMovies.css';

const ImportMovies: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [importFinished, setImportFinished] = useState<boolean>(false);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [skippedCount, setSkippedCount] = useState<number>(0);
  const [skippedTitles, setSkippedTitles] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const parseFileContent = (text: string) => {
    const entries = text.trim().replace(/\r/g, '').split(/\n{2,}/);
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
              .map(actor => actor.replace(/[\u200B-\u200D\uFEFF\u00A0\t]/g, '').trim())
              .filter(Boolean);
            movie.actors = actors;
            break;
        }
      });

      return movie;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setImportFinished(false);
    setImportedCount(0);
    setSkippedCount(0);
    setSkippedTitles([]);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const text = reader.result as string;
        const movies = parseFileContent(text);

        let imported = 0;
        let skipped = 0;
        const skippedList: string[] = [];

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
              imported++;
            } catch (err: any) {
              if (typeof err === 'string' && err.includes('вже існує')) {
                skipped++;
                skippedList.push(movie.title);
                console.warn(`⚠️ Пропущено дублікат: ${movie.title}`);
              } else {
                console.error(`❌ Помилка при додаванні: ${movie.title}`, err);
                setError('Помилка при додаванні деяких фільмів');
              }
            }
          } else {
            console.warn('⏭️ Пропущено некоректний запис:', movie);
            skipped++;
          }
        }

        await dispatch(fetchMovies());

        setImportedCount(imported);
        setSkippedCount(skipped);
        setSkippedTitles(skippedList);

        setImportFinished(true);
      } catch (err) {
        console.error('❌ Помилка парсингу:', err);
        setError('Помилка при парсингу файлу');
      }

      // Очищуємо вибір файлу, щоб можна було імпортувати той самий файл повторно
      e.target.value = '';
    };

    reader.onerror = () => {
      setError('Не вдалось прочитати файл');
      // Очищуємо вибір файлу навіть при помилці
      e.target.value = '';
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

      {importFinished && (
        <div className="success-message">
          ✅ Імпортовано {importedCount} фільм(ів).
          <br />
          ⚠️ Пропущено {skippedCount} (дублі або некоректні записи).
        </div>
      )}

      {skippedTitles.length > 0 && (
        <div className="error-message">
          ❗ Наступні фільми вже існують і не були додані:
          <ul>
            {skippedTitles.map((title, index) => (
              <li key={index}>– {title}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ImportMovies;
