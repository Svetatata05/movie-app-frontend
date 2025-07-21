import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import './Home.css';

const carouselImages = [
  '/images/film1.jpg',
  '/images/film2.jpg',
  '/images/film3.jpg',
];

const movieDescription = `
Фільмотека — це твій персональний кіноархів! 
Тут ти можеш зберігати улюблені фільми, шукати за назвою чи актором, а також додавати нові стрічки до своєї колекції.
Зручно, швидко та цікаво!
`;

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <Carousel
        fade
        controls={false}
        indicators={false}
        interval={3000}
        className="home-carousel"
      >
        {carouselImages.map((img, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100 carousel-img"
              src={img}
              alt={`Slide ${idx + 1}`}
              loading="lazy"
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Контент зверху каруселі */}
      <div className="home-content-top d-flex flex-column justify-content-start align-items-center text-center">
        <h1 className="display-3 mb-3 fw-bold text-shadow bg-dark bg-opacity-50 p-3 rounded">
          Вітаємо у Фільмотеці!
        </h1>
        <p className="lead mb-3 text-shadow bg-dark bg-opacity-50 p-2 rounded">
          Зберігай улюблені фільми, шукай по назві або актору та додавай нові.
        </p>
        <Link to="/catalog" className="btn btn-primary btn-lg mb-4 shadow-sm">
          Перейти до колекції
        </Link>

       
      </div>

      {/* Опис сайту під каруселлю */}
      <div className="movie-description-container">
        <p>{movieDescription}</p>
      </div>
    </div>
  );
};

export default HomePage;
