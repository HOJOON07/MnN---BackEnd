const mongoose = require('mongoose');

const { MONGO_DB_URI } = process.env;

const connection = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI, {
      dbName: 'MnN',
      useNewUrlParser: true,
    });
    console.log('mongoose connection success');

    mongoose.connection.on('error', (err) => {
      console.error('몽고 디비 연결 에러', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.error('몽고 디비 연결이 끊어졌습니다. 연결을 재시도 합니다!');
      connect();
    });
  } catch (err) {
    console.error(err);
  }
};
connection();
module.exports = connection;
