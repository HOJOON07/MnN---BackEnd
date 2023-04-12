const express = require('express');
const router = express.Router();
const {
  createWS,
  getAllWS,
  inviteUser,
  selectWS,
  deleteWS,
  addTodoList,
  deleteTodoList,
  addInprogressList,
  deleteInprogressList,
  addDoneList,
  deleteDoneList,
} = require('../controllers/workspaceController');

//workspace
router.get('/', getAllWS);
router.post('/addws', createWS);
router.get('/:id', selectWS);
router.post('/:id/addmember', inviteUser);
router.post('/:id/deletews', deleteWS);

//workspace-workflow
router.post('/:id/addtodolist', addTodoList);
router.post('/:id/:todoid/deletetodolist', deleteTodoList);

router.post('/:id/addinprogresslist', addInprogressList);
router.post('/:id/:inprogressid/deleteinprogresslist', deleteInprogressList);

router.post('/:id/adddonelist', addDoneList);
router.post('/:id/:doneid/deletedonelist', deleteDoneList);
module.exports = router;
