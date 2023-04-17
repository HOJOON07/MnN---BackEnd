const mongoConnect = require('./mongoConnect');
const { ObjectId } = require('mongodb');
const WorkSpace = require('../models/workspace');

// workspace
const createWS = async (req, res) => {
  try {
    const createData = await WorkSpace.create({
      workspace_name: req.body.workspace_name,
      workspace_category: req.body.workspace_category,
      workspace_type: req.body.workspace_type,
      workspace_startDate: req.body.workspace_startDate,
      workspace_endDate: req.body.workspace_endDate,
      githubRepository: req.body.githubRepository,
      member: req.body.member,
      workflow: {
        requestList: [],
        inProgressList: [],
        inReviewList: [],
        blockedList: [],
        completedList: [],
      },
    });
    return res.status(200).json(createData);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const inviteUser = async (req, res) => {
  try {
    const selectWS = await workspace.findOne({
      _id: ObjectId(req.params.id),
    });
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      { $set: { member: [...selectWS.member, req.body.member] } },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const getAllWS = async (req, res) => {
  try {
    const allWS = await WorkSpace.find({});
    // res.render('workspace.ejs', { allWS });
    if (!allWS) return res.status(400).send('실패');
    return res.status(200).json(allWS);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const selectWS = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    console.log(selectWS);
    // if (!selectWS) res.statsus(400).send(err.message);
    // return res.status(200).json(selectWS);
    res.render('workspace_workflow.ejs', { selectWS });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const deleteWS = async (req, res) => {
  try {
    const deleteWS = await WorkSpace.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.redirect('/');
    // return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// workspace-workflow
const updateAllWF = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: req.body.workflow,
        },
      },
    );
    return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

//requestList
const addRequestList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [
              ...selectWS.workflow.requestList,
              {
                id: String(new ObjectId()),
                content: req.body.requestList_content,
                createDate: new Date(),
                endDate: req.body.requestList_endDate,
                importance: req.body.requestList_importance,
              },
            ],
            inProgressList: [...selectWS.workflow.inProgressList],
            inReviewList: [...selectWS.workflow.inReviewList],
            blockedList: [...selectWS.workflow.blockedList],
            completedList: [...selectWS.workflow.completedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
const updateRequestList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const modifyRequestIndex = selectWS.workflow.requestList.findIndex(
      (data) => data.id == req.params.requestid,
    );
    selectWS.workflow.requestList[modifyRequestIndex].content =
      req.body.modifyContent;
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            ...selectWS.workflow,
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.log(err);
  }
};
const deleteRequestList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const remainRequestList = selectWS.workflow.requestList.filter(
      (data) => data.id != req.params.requestid,
    );
    console.log(remainRequestList);
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...remainRequestList],
            inProgressList: [...selectWS.workflow.inProgressList],
            inReviewList: [...selectWS.workflow.inReviewList],
            blockedList: [...selectWS.workflow.blockedList],
            completedList: [...selectWS.workflow.completedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
  }
};

//inprogressList
const addInProgressList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...selectWS.workflow.requestList],
            inProgressList: [
              ...selectWS.workflow.inProgressList,
              {
                id: String(new ObjectId()),
                content: req.body.inProgressList_content,
                createDate: new Date(),
                endDate: req.body.inProgressList_endDate,
                importance: req.body.inProgressList_importance,
              },
            ],
            inReviewList: [...selectWS.workflow.inReviewList],
            blockedList: [...selectWS.workflow.blockedList],
            completedList: [...selectWS.workflow.completedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
const updateInProgressList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const modifyInProgressIndex = selectWS.workflow.inProgressList.findIndex(
      (data) => data.id == req.params.inprogressid,
    );
    selectWS.workflow.inProgressList[modifyInProgressIndex].content =
      req.body.modifyContent;
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            ...selectWS.workflow,
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.log(err);
  }
};
const deleteInProgressList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const remainInProgressList = selectWS.workflow.inProgressList.filter(
      (data) => data.id != req.params.inprogressid,
    );
    console.log(remainInProgressList);
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...selectWS.workflow.requestList],
            inProgressList: [...remainInProgressList],
            inReviewList: [...selectWS.workflow.inReviewList],
            blockedList: [...selectWS.workflow.blockedList],
            completedList: [...selectWS.workflow.completedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
  }
};

//inreview list
const addInReviewList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...selectWS.workflow.requestList],
            inProgressList: [...selectWS.workflow.inProgressList],
            inReviewList: [
              ...selectWS.workflow.inReviewList,
              {
                id: String(new ObjectId()),
                content: req.body.inReviewList_content,
                createDate: new Date(),
                endDate: req.body.inReviewList_endDate,
                importance: req.body.inReviewList_importance,
              },
            ],
            blockedList: [...selectWS.workflow.blockedList],
            completedList: [...selectWS.workflow.completedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
const updateInReviewList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const modifyInReviewIndex = selectWS.workflow.inReviewList.findIndex(
      (data) => data.id == req.params.inreviewid,
    );
    selectWS.workflow.inReviewList[modifyInReviewIndex].content =
      req.body.modifyContent;
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            ...selectWS.workflow,
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.log(err);
  }
};
const deleteInReviewList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const remainReviewList = selectWS.workflow.inReviewList.filter(
      (data) => data.id != req.params.inreviewid,
    );
    console.log(remainReviewList);
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...selectWS.workflow.requestList],
            inProgressList: [...selectWS.workflow.inProgressList],
            inReviewList: [...remainReviewList],
            blockedList: [...selectWS.workflow.blockedList],
            completedList: [...selectWS.workflow.completedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
  }
};

// blocked list
const addBlockedList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...selectWS.workflow.requestList],
            inProgressList: [...selectWS.workflow.inProgressList],
            inReviewList: [...selectWS.workflow.inReviewList],
            blockedList: [
              ...selectWS.workflow.blockedList,
              {
                id: String(new ObjectId()),
                content: req.body.blockedList_content,
                createDate: new Date(),
                endDate: req.body.blockedList_endDate,
                importance: req.body.blockedList_importance,
              },
            ],
            completedList: [...selectWS.workflow.completedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
const updateBlockedList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const modifyBlockedIndex = selectWS.workflow.blockedList.findIndex(
      (data) => data.id == req.params.blockedid,
    );
    selectWS.workflow.blockedList[modifyBlockedIndex].content =
      req.body.modifyContent;
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            ...selectWS.workflow,
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.log(err);
  }
};
const deleteBlockedList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const remainBlockedList = selectWS.workflow.blockedList.filter(
      (data) => data.id != req.params.blockedid,
    );
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...selectWS.workflow.requestList],
            inProgressList: [...selectWS.workflow.inProgressList],
            inReviewList: [...selectWS.workflow.inReviewList],
            blockedList: [...remainBlockedList],
            completedList: [...selectWS.workflow.completedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
  }
};

// completed list
const addCompletedList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...selectWS.workflow.requestList],
            inProgressList: [...selectWS.workflow.inProgressList],
            inReviewList: [...selectWS.workflow.inReviewList],
            blockedList: [...selectWS.workflow.blockedList],
            completedList: [
              ...selectWS.workflow.completedList,
              {
                id: String(new ObjectId()),
                content: req.body.completedList_content,
                createDate: new Date(),
                endDate: req.body.completedList_endDate,
                importance: req.body.completedList_importance,
              },
            ],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
const updateCompletedList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const modifyCompletedIndex = selectWS.workflow.completedList.findIndex(
      (data) => data.id == req.params.completedid,
    );
    selectWS.workflow.completedList[modifyCompletedIndex].content =
      req.body.modifyContent;
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            ...selectWS.workflow,
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.log(err);
  }
};
const deleteCompletedList = async (req, res) => {
  try {
    const selectWS = await WorkSpace.findOne({
      _id: ObjectId(req.params.id),
    });
    const remainCompletedList = selectWS.workflow.completedList.filter(
      (data) => data.id != req.params.completedid,
    );
    await WorkSpace.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          workflow: {
            requestList: [...selectWS.workflow.requestList],
            inProgressList: [...selectWS.workflow.inProgressList],
            inReviewList: [...selectWS.workflow.inReviewList],
            blockedList: [...selectWS.workflow.blockedList],
            completedList: [...remainCompletedList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
    // return res.status(200);
  } catch (err) {
    console.error(err);
  }
};
module.exports = {
  createWS,
  getAllWS,
  selectWS,
  deleteWS,
  inviteUser,

  updateAllWF,

  addRequestList,
  updateRequestList,
  deleteRequestList,

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
};
