const express = require('express');

require('dotenv').config();

const app = express();

app.use(express.static('public')); // public로 상위 폴더 변경

const { PORT } = process.env;

//라우터
const homeRouter = require('./routes/home');
const testRouter = require('./routes/test');

app.use('/', homeRouter);
app.use('/test', testRouter);

app.listen(PORT, () => {
  console.log(`포트번호 ${PORT}번 실행`);
});
