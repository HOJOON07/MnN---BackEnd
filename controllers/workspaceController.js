const mongoConnect = require('./mongoConnect');
const { ObjectId } = require('mongodb');
const WorkSpace = require('../models/workspace');
const workspace = require('../models/workspace');

const createWS = async (req, res) => {
  try {
    await WorkSpace.create({
      name: req.body.name,
      workflow: [],
      member: [],
    });
    res.redirect('/workspace');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

const getAllWS = async (req, res) => {
  try {
    const allWS = await WorkSpace.find({});
    res.render('workspace.ejs', { allWS });
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

module.exports = {
  createWS,
  getAllWS,
  selectWS,
  createWF,
  inviteUser,
};
