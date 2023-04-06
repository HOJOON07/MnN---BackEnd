const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('test 페이지 router 입니다.')
})

module.exports = router;
