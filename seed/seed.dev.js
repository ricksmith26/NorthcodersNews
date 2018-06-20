const seedDB = require('./seed');
const mongoose = require('mongoose');
//const rawData = require('./devData');
const { DB_URL } = require('../config');
const {
  articleData,
  commentData,
  topicData,
  usersData
} = require('./testData/index');

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('b4 run seed');
    return seedDB(articleData, commentData, topicData, usersData);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`successfully disconnected from ${DB_URL}...`);
  })
  .catch(console.log);
