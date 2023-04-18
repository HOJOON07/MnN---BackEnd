const express = require('express');
const router = express.Router();
const {
  createWS,
  getMyWS,
  getAllWS,
  inviteUser,
  selectWS,
  deleteWS,
  addRequestList,
  updateRequestList,
  deleteRequestList,

  updateAllWF,

  addInProgressList,
  updateInProgressList,
  deleteInProgressList,

  addInReviewList,
  updateInReviewList,
  deleteInReviewList,

  addBlockedList,
  updateBlockedList,
  deleteBlockedList,

  addCompletedList,
  updateCompletedList,
  deleteCompletedList,
} = require('../controllers/workspaceController');

//workspace
router.get('/', getAllWS);
router.get('/myws', getMyWS);
router.post('/addws', createWS);
router.get('/:id', selectWS);
router.post('/:id/addmember', inviteUser);
router.post('/:id/deletews', deleteWS);

//workspace-workflow
router.post('/:id/updatewf', updateAllWF);

//request list
router.post('/:id/addrequestlist', addRequestList);
router.post('/:id/:requestid/deleterequestlist', deleteRequestList);
router.post('/:id/:requestid/updaterequestlist', updateRequestList);

//inprogress list
router.post('/:id/addinprogresslist', addInProgressList);
router.post('/:id/:inprogressid/deleteinprogresslist', deleteInProgressList);
router.post('/:id/:inprogressid/updateinprogresslist', updateInProgressList);

//inReview list
router.post('/:id/addinreviewlist', addInReviewList);
router.post('/:id/:inreviewid/deleteinreviewlist', deleteInReviewList);
router.post('/:id/:inreviewid/updateinreviewlist', updateInReviewList);

//blocked list
router.post('/:id/addblockedlist', addBlockedList);
router.post('/:id/:blockedid/deleteblockedlist', deleteBlockedList);
router.post('/:id/:blockedid/updateblockedlist', updateBlockedList);

//completed list
router.post('/:id/addcompletedlist', addCompletedList);
router.post('/:id/:completedid/deletecompletedlist', deleteCompletedList);
router.post('/:id/:completedid/updatecompletedlist', updateCompletedList);
module.exports = router;
