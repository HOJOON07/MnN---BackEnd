const express = require('express');
const { accessToken, refreshToken } = require('../controllers/userController');

const tokenRouter = express.Router();

tokenRouter.get('/accesstoken', accessToken);
tokenRouter.get('/refreshtoken', refreshToken);
module.exports = tokenRouter;
