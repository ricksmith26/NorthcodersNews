const seedDB = require('./seed');
const mongoose = require('mongoose');
//const rawData = require('./devData');
const { DB_URL } = require('../config');
const rawData = require('./testData/index');
console.log(DB_URL);
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('b4 run seed');
    return seedDB(rawData);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`successfully disconnected from ${DB_URL}...`);
  })
  .catch(console.log);
