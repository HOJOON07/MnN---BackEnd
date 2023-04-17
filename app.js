const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

const passportConfig = require('./passport');
// passportConfig(app);

const { PORT } = process.env;
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//라우터
const homeRouter = require('./routes/home');

const tokenRouter = require('./routes/token');

const userRouter = require('./routes/userRouter');

app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/token', tokenRouter);
app.use('/auth', [userRouter]); //카카오

const workspaceRouter = require('./routes/workspace');

app.use('/', homeRouter);
app.use('/workspace', workspaceRouter);

app.listen(PORT, () => {
  console.log(`포트번호 ${PORT}번 실행`);
});
