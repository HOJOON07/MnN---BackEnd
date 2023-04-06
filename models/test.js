const mongoose = require('mongoose');

const { Schema } = mongoose;

const testSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'test',
    versionKey: false,
  },
);

module.exports = mongoose.model('Test', testSchema);
