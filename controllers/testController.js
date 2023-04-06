// const { ObjectId } = require('mongodb');
const mongoConnect = require('./mongoConnect');
const Test = require('../models/test');

const createDB = async (req, res) => {
  try {
    await Test.create({
      name: 'test',
    });
    res.status(200).send('success');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = { createDB };
