const express = require('express');
const passport = require('passport');

const {
  signUpUser,
  loginUser,
  addUserInfo,
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/kakao', passport.authenticate('kakao'));
userRouter.get(
  '/kakao/callback',
  userRouter.get(
    '/oauth/kakao/callback',
    passport.authenticate('kakao-login', {
      failureRedirect: '/',
    }),
    (req, res) => {
      res.redirect('/');
    },
  ),
);

userRouter.post('/signup', signUpUser);
userRouter.post('/login', loginUser);
userRouter.post('/adduserinfo', addUserInfo);

module.exports = userRouter;
