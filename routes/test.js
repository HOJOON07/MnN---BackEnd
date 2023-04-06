const express = require('express');
const { createDB } = require('../controllers/testController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('test 페이지 router 입니다.');
});

router.post('/createDB', createDB);

module.exports = router;
