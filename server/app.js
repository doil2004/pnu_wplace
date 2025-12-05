// server/app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const cellRoutes = require('./routes/cells');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

// 정적 파일 (프론트)
app.use(express.static(path.join(__dirname, '..', 'public')));

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/cells', cellRoutes);

// 기본 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
