const mongoConnect = require('./mongoConnect');
const { ObjectId } = require('mongodb');
const WorkSpace = require('../models/workspace');
const workspace = require('../models/workspace');

const createWS = async (req, res) => {
  try {
    await WorkSpace.create({
      workspace_name: req.body.workspace_name,
      workspace_category: req.body.workspace_category,
      workspace_startDate: req.body.workspace_startDate,
      workspace_endDate: req.body.workspace_endDate,
      githubRepository: req.body.githubRepository,
      member: req.body.member,
      workflow: { todoList: [], inprogressList: [], doneList: [] },
    });
    res.redirect('/workspace');
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
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const getAllWS = async (req, res) => {
  try {
    const allWS = await WorkSpace.find({});
    res.render('workspace.ejs', { allWS });
    // if (!allWS) return res.status(400).send('실패');
    // return res.status(200).json(allWS);
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
    if (!selectWS) res.statsus(400).send(err.message);
    res.render('workspace_workflow.ejs', { selectWS });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const createWF = async (req, res) => {
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
          workflow: [
            ...selectWS.workflow,
            {
              name: req.body.workflow_name,
              createDate: new Date(),
              endDate: req.body.workflow_endDate,
            },
          ],
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const addTodoList = async (req, res) => {
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
            todoList: [
              ...selectWS.workflow.todoList,
              {
                content: req.body.todoList_content,
                createDate: new Date(),
                endDate: req.body.todoList_endDate,
                importance: req.body.todoList_importance,
              },
            ],
            inprogressList: [...selectWS.workflow.inprogressList],
            doneList: [...selectWS.workflow.doneList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const addInprogressList = async (req, res) => {
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
            todoList: [...selectWS.workflow.todoList],
            inprogressList: [
              ...selectWS.workflow.inprogressList,
              {
                content: req.body.inprogressList_content,
                createDate: new Date(),
                endDate: req.body.inprogressList_endDate,
                importance: req.body.inprogressList_importance,
              },
            ],
            doneList: [...selectWS.workflow.doneList],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const addDoneList = async (req, res) => {
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
            todoList: [...selectWS.workflow.todoList],
            inprogressList: [...selectWS.workflow.inprogressList],
            doneList: [
              ...selectWS.workflow.doneList,
              {
                content: req.body.doneList_content,
                createDate: new Date(),
                endDate: req.body.doneList_endDate,
                importance: req.body.doneList_importance,
              },
            ],
          },
        },
      },
    );
    res.redirect('/workspace/' + req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  createWS,
  getAllWS,
  selectWS,
  createWF,
  inviteUser,
  addTodoList,
  addInprogressList,
  addDoneList,
};
