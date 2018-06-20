const { User, Article, Comment, Topic } = require('../models/index');
const mongoose = require('mongoose');
// const {
//   articleData,
//   commentData,
//   topicData,
//   usersData
// } = require('./testData/index');
const changeArticleTopicId = require('../utils/index');

const seedDB = (articleData, commentData, topicData, usersData) => {
  console.log(topicData, '<<<<<<<<<<<<topicData');
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      console.log('b4 insert');
      return Topic.insertMany(topicData);
    })
    .then(topicDocs => {
      console.log(topicDocs, '<<<<@@@@');
      return changeArticleTopicId(articleData, topicDocs);
    })
    .then(console.log)
    .catch(console.log);
};

module.exports = seedDB;
