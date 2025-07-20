const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'very_secret_key';

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// Тимчасове зберігання користувачів
const users = [];

// Тимчасове зберігання фільмів
const movies = [
  { id: 1, title: 'Casablanca2', year: 1942, format: 'DVD', actors: ['Humphrey Bogart', 'Ingrid Bergman'] },
  { id: 2, title: 'Blazing Saddles2', year: 1974, format: 'VHS', actors: ['Cleavon Little', 'Gene Wilder'] },
];

// Middleware для перевірки JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Відсутній токен авторизації' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Невірний формат токена' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Токен не валідний' });
    req.user = user;
    next();
  });
}

// Реєстрація
app.post('/api/v1/users', async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;

  if (!email || !name || !password || password !== confirmPassword) {
    return res.status(400).json({ message: 'Неправильні дані' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Користувач вже існує' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, name, password: hashedPassword });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Логін
app.post('/api/v1/sessions', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.status(401).json({ message: 'Користувача не знайдено' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Невірний пароль' });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Отримати список фільмів
app.get('/api/v1/movies', authenticateToken, (req, res) => {
  res.json({ status: 1, data: movies });
});

// Додати новий фільм
app.post('/api/v1/movies', authenticateToken, (req, res) => {
  const { title, year, format, actors } = req.body;
  const yearNum = Number(year);

  if (!title || !yearNum || !format || !actors || !Array.isArray(actors)) {
    return res.status(400).json({ message: 'Неправильні дані фільму' });
  }

  if (movies.find(m => m.title.toLowerCase() === title.toLowerCase())) {
    return res.status(409).json({ message: 'Фільм вже існує' });
  }

  const newMovie = {
    id: movies.length + 1,
    title,
    year: yearNum,
    format,
    actors,
  };

  movies.push(newMovie);
  res.status(201).json({ status: 1, data: newMovie });
});
// Видалити фільм за id
app.delete('/api/v1/movies/:id', authenticateToken, (req, res) => {
    const id = Number(req.params.id);
  
    const index = movies.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Фільм не знайдено' });
    }
  
    movies.splice(index, 1);
    res.json({ status: 1, message: 'Фільм видалено' });
  });
// Віддача React фронтенду
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
