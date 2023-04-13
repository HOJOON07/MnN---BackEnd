const express = require('express');
const router = express.Router();
const {
  createWS,
  getAllWS,
  inviteUser,
  selectWS,
  deleteWS,
  addTodoList,
  updateTodoList,
  deleteTodoList,
  addInprogressList,
  updateInprogressList,
  deleteInprogressList,
  addDoneList,
  updateDoneList,
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
router.post('/:id/:todoid/updatetodolist', updateTodoList);

router.post('/:id/addinprogresslist', addInprogressList);
router.post('/:id/:inprogressid/deleteinprogresslist', deleteInprogressList);
router.post('/:id/:inprogressid/updateinprogresslist', updateInprogressList);

router.post('/:id/adddonelist', addDoneList);
router.post('/:id/:doneid/deletedonelist', deleteDoneList);
router.post('/:id/:doneid/updatedonelist', updateDoneList);
module.exports = router;
