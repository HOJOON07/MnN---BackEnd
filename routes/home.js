const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('/ 페이지 라우터 입니다.');
});

module.exports = router;
