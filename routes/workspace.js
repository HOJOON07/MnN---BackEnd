const express = require('express');
const router = express.Router();
const {
  createWS,
  getAllWS,
  inviteUser,
  selectWS,
  addTodoList,
  addInprogressList,
  addDoneList,
} = require('../controllers/workspaceController');

router.get('/', getAllWS);
router.post('/addws', createWS);
router.get('/:id', selectWS);
router.post('/:id/addmember', inviteUser);
router.post('/:id/addtodolist', addTodoList);
router.post('/:id/addinprogresslist', addInprogressList);
router.post('/:id/adddonelist', addDoneList);
module.exports = router;
