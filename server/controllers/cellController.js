// server/controllers/cellController.js
const { getAllCells, upsertCell } = require('../models/cellModel');

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

    const cell = await upsertCell({
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      color,
      ownerId: req.session.userId,
    });

    res.json(cell);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '셀 업데이트 오류' });
  }
};
