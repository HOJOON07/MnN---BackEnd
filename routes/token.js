const express = require('express');
const {
  accessTokenMiddleware,
  refreshToken,
} = require('../controllers/userController');

const tokenRouter = express.Router();

tokenRouter.get('/accesstoken', accessTokenMiddleware);
tokenRouter.get('/refreshtoken', refreshToken);
module.exports = tokenRouter;
