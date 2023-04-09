const mongoose = require('mongoose');

const { Schema } = mongoose;

const testUserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
  },
  {
    collection: 'test-user',
    versionKey: false,
  },
);

module.exports = mongoose.model('TestUser', testUserSchema);
