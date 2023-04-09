const mongoConnect = require('./mongoConnect');
const TestUser = require('../models/testUser');

const createUser = async (req, res) => {
  try {
    await TestUser.create({
      id: 'test',
      password: 'test1234',
      name: 'park',
    });
    res.status(200).send('success');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
