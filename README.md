# movie-react-app

Це односторінкова веб-програма для керування інформацією про фільми. Побудована на основі React + TypeScript + Redux Toolkit з використанням Docker для розгортання.

# Функціонал

Додавання / видалення фільмів

Перегляд детальної інформації про фільм

Сортування фільмів за назвою

Пошук фільмів за назвою та ім’ям актора

Імпорт фільмів з текстового файлу (sample_movies.txt)

Аутентифікація користувачів (реєстрація та логін)

# Швидкий старт

Запуск усієї програми через Docker Compose

```bash
docker-compose up --build
Frontend буде доступний на: http://localhost:3000

Backend — на: http://localhost:8000/api/v1

Переконайтесь, що Docker Daemon запущений.

 Ручний запуск компонентів
 Бекенд (через Docker)
 docker run --name movies-backend -p 8000:8000 --platform linux/amd64 webbylabhub/movies

 Фронтенд (локально)

npm install
npm start
або
yarn install
yarn start

# Побудова Docker-образу та запуск

 docker build -t koturlashsvitlana/movies .
docker run --name movies -p 3000:3000 -p 8000:8000 -e REACT_APP_API_URL=http://localhost:8000/api/v1 koturlashsvitlana/movies

# Конфігурація
Головна змінна:
REACT_APP_API_URL=http://localhost:8000/api/v1

Може задаватися через .env файл або флаг -e при запуску Docker-контейнера.

# Аутентифікація
 Реєстрація користувача

curl --location 'http://localhost:8000/api/v1/users' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "petro@gmail.com",
  "name": "Petrov Petro",
  "password": "super-password",
  "confirmPassword": "super-password"
}'
# Логін

curl --location 'http://localhost:8000/api/v1/sessions' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "petro@gmail.com",
  "password": "super-password"
}'
# Токен
У відповіді ви отримаєте JWT-токен. Він автоматично передається в запитах до захищених ресурсів:
Authorization: Bearer <токен>
🧪 Приклад компоненту
<LoginForm /> — компонент для введення email і пароля.

# Імпорт фільмів з файлу
Через веб-інтерфейс ви можете імпортувати список фільмів з файлу sample_movies.txt.

Зразок файлу: gist.github.com/k0stik/sample_movies.txt

# API
Проєкт використовує API-сервер на основі образу:

🔗(https://hub.docker.com/r/webbylabhub/movies)(DockerHub)
🔗 (https://documenter.getpostman.com/view/356840/TzkyLeVK) (Postman)

# Архітектура
React + Redux Toolkit (RTK) + TypeScript

Стейт менеджмент через RTK slices

HTTP запити через Axios

Аутентифікація через JWT

Docker/Docker Compose для запуску всіх сервісів

📎 Посилання Репозиторій та образ
🔗 GitHub репозиторій: github.com/your-account/movies-app

🔗 DockerHub образ: dockerhub.com/koturlashsvitlana/movies

# Запуск в один рядок
docker run --name movies -p 3000:3000 -p 8000:8000 -e REACT_APP_API_URL=http://localhost:8000/api/v1 koturlashsvitlana/movies

# Перш ніж увійти
Після запуску проєкту вперше, необхідно зареєструвати користувача через термінал (оскільки база пуста):

curl --location 'http://localhost:8000/api/v1/users' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "petro@gmail.com",
  "name": "Petrov Petro",
  "password": "super-password",
  "confirmPassword": "super-password"
}'

Після цього ви зможете увійти через вебінтерфейс, використовуючи введені дані.
```
