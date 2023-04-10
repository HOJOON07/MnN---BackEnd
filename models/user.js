const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 14,
      unique: true,
      trim: true,
    },
    user_password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 14,
      unique: true,
      trim: true,
    },
    user_name: {
      type: String,
      required: true,
      trim: true,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+@..+/,
      trim: true,
    },
    tel: {
      type: String,
      required: true,
    },
    position: {
      enum: [
        'FrontEnd',
        'BackEnd',
        'GameDeveloper',
        'FullStack',
        'App Developer',
      ], // 수정해야함 .
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
    },
    skills: {
      type: String,
    },
    img: {},
    user_workspace: {},
  },
  {
    collection: 'user',
  },
);

module.exports = mongoose.model('User', userSchema);
