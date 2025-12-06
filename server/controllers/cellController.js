// server/controllers/cellController.js
const { getAllCells, upsertCell } = require('../models/cellModel');
const { findUserById } = require('../models/userModel');  // ✅ 닉네임 조회용

exports.getCells = async (req, res) => {
  try {
    const cells = await getAllCells();
    res.json(cells);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '셀 조회 오류' });
  }
};

exports.updateCell = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const { x, y, color } = req.body;
    if (x == null || y == null || !color) {
      return res.status(400).json({ message: 'x, y, color 필요' });
    }

    // DB 저장
    const cell = await upsertCell({
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      color,
      ownerId: req.session.userId,
    });

    // 이 유저의 닉네임 가져오기
    const user = await findUserById(req.session.userId);
    const payload = {
      x: cell.x,
      y: cell.y,
      color: cell.color,
      nickname: user.nickname,
    };

    // ✅ WebSocket으로 전파
    const io = req.app.get('io');
    io.emit('cell_update', payload);

    // 클라이언트에도 응답
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '셀 업데이트 오류' });
  }
};
