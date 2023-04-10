const mongoose = require('mongoose');

const { Schema } = mongoose;

const workSpaceSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    workflow: {
      type: Object,
      require: true,
    },
    member: {
      type: Object,
      require: true,
    },
  },
  {
    collection: 'test-workspace',
    versionKey: false,
  },
);

module.exports = mongoose.model('WorkSpace', workSpaceSchema);
