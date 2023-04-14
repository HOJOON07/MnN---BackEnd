const express = require('express');
const passport = require('passport');

const {
  signUpUser,
  loginUser,
  addUserInfo,
  logout,
  kakaoLogin,
  githubLogin,
  gitLogin,
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

module.exports = userRouter;
