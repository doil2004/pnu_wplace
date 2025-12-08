// server/app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');             // ✅ 중요: HTTP 서버
const { Server } = require('socket.io');  // ✅ 중요: Socket.IO
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const cellRoutes = require('./routes/cells');

const app = express();

// ✅ Express 앱으로부터 HTTP 서버 생성
const server = http.createServer(app);

// ✅ HTTP 서버에 Socket.IO 붙이기
const io = new Server(server);

// 나중에 컨트롤러에서 io 사용하기 위해 app에 저장
app.set('io', io);

// (선택) 소켓 연결 로그
io.on('connection', (socket) => {
  console.log('✅ WebSocket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected:', socket.id);
  });
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

// 정적 파일 제공 (public 폴더)
app.use(express.static(path.join(__dirname, '..', 'public')));

// API 라우터
app.use('/api/auth', authRoutes);
app.use('/api/cells', cellRoutes);

// 루트 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use('/client', express.static(path.join(__dirname, '..', 'client')));

// ✅ 여기서 express가 아니라 http 서버를 listen 해야 함
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
