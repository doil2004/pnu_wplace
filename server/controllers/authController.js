// server/controllers/authController.js
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail, findUserById } = require('../models/userModel');

const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || !password || !nickname) {
      return res.status(400).json({ message: 'email, password, nickname 필요' });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({ email, passwordHash, nickname });

    req.session.userId = user.id;
    res.json({ id: user.id, email: user.email, nickname: user.nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '회원가입 중 오류' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: '존재하지 않는 이메일입니다.' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(400).json({ message: '비밀번호가 올바르지 않습니다.' });
    }

    req.session.userId = user.id;
    res.json({ id: user.id, email: user.email, nickname: user.nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '로그인 중 오류' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'ok' });
  });
};

exports.me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json(null);
    }
    const user = await findUserById(req.session.userId);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'me 조회 오류' });
  }
};
