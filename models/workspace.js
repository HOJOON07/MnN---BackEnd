const mongoose = require('mongoose');

const { Schema } = mongoose;

const workSpaceSchema = new Schema(
  {
    workspace_name: {
      type: String,
      require: true,
    },
    workspace_category: {
      type: String,
      require: true,
    },
    workspace_startDate: {
      type: Date,
    },
    workspace_endDate: {
      type: Date,
    },
    githubRepository: {
      type: String,
    },
    member: {
      type: Object,
      require: true,
    },
    workflow: {
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