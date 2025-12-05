// server/routes/cells.js
const express = require('express');
const router = express.Router();
const cellController = require('../controllers/cellController');

router.get('/', cellController.getCells);
router.post('/', cellController.updateCell);

module.exports = router;
