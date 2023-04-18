const express = require('express');
const passport = require('passport');

const {
  signUpUser,
  loginUser,
  addUserInfo,
  logout,
  loginSuccess,
  kakaoLogin,
  githubLogin,
  gitLogin,
  accessTokenMiddleware,
  refreshToken,
  test,
  checkID,
  checkEmail,
  searchUser,
  userList,
} = require('../controllers/userController');
const user = require('../models/user');

const userRouter = express.Router();

userRouter.post('/signup', signUpUser);
userRouter.post('/login', loginUser);
userRouter.post('/adduserinfo', addUserInfo);
userRouter.post('/logout', logout);
userRouter.post('/kakaologin', kakaoLogin);
userRouter.post('/githublogin', githubLogin);
userRouter.post('/gitloginsuccess', gitLogin);
userRouter.get('/loginsuccess', loginSuccess);
userRouter.post('/test', accessTokenMiddleware, test);
userRouter.post('/checkid', checkID);
userRouter.post('/checkemail', checkEmail);
userRouter.post('/search', searchUser);
userRouter.post('/userlist', userList);

module.exports = userRouter;
