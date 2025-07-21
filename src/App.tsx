import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { MoviesList } from './features/movies/MoviesList';
import ImportMovies from './features/movies/ImportMovies';
import MoviePage from './pages/MovieDetailsPage';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { useAppSelector } from './app/hooks';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddMoviePage from './pages/AddMoviePage'
import MoviesCatalogPage from './pages/MoviesCatalogPage';
import './App.css';
function AppContent() {
  const token = useAppSelector(state => state.user.token);

  if (!token) {
    // Якщо токена немає — показуємо форму логіну
    return <LoginForm />;
  }

  // Якщо токен є — показуємо основний інтерфейс з меню і маршрутами
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route path="/import" element={<ImportMovies />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/movies/add" element={<AddMoviePage />} />
          <Route path="/catalog" element={<MoviesCatalogPage />} />
       
        </Routes>
        <footer className="video-footer">
  <video autoPlay loop muted playsInline className="footer-video">
    <source src="/videos/smoke.mp4" type="video/mp4" />
    Ваш браузер не підтримує відео.
  </video>

  <div className="footer-overlay">
    <p className="footer-text">Насолоджуйтесь переглядом!</p>
    <div className="social-bar">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <img src="/icons/facebook.png" alt="Facebook" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <img src="/icons/instagram.png" alt="Instagram" />
      </a>
      <a href="https://t.me" target="_blank" rel="noopener noreferrer">
        <img src="/icons/telegram.png" alt="Telegram" />
      </a>
      <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
        <img src="/icons/tiktok.png" alt="TikTok" />
      </a>
      <a href="viber://chat?number=+380999993636" target="_blank" rel="noopener noreferrer">
        <img src="/icons/viber.png" alt="Viber" />
      </a>
    </div>
  </div>
</footer>

      </div>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
