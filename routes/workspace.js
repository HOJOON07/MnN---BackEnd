const express = require('express');
const router = express.Router();
const {
  createWS,
  getAllWS,
  selectWS,
  createWF,
  inviteUser,
} = require('../controllers/workspaceController');

router.get('/', getAllWS);

router.post('/addws', createWS);

router.get('/:id', selectWS);

router.post('/:id/addwf', createWF);
router.post('/:id/addmember', inviteUser);
module.exports = router;
