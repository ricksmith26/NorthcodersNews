const { User, Article, Comment, Topic } = require('../models/index');
const mongoose = require('mongoose');
const {
  articleData,
  commentData,
  topicData,
  usersData
} = require('./testData/index');
const { changeArticeTopicId } = require('../utils/index');

const seedDB = (topicData, articleData) => {
  console.log(topicData, '<<<<<<<<<<<<topicData');
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      console.log('b4 insert');
      return Topic.insertMany(topicData);
    })

    .then(topicDocs => {
      console.log(topicDocs);
      changeArticeTopicId(topicDocs, articleData);
    })

    .catch(console.log);
};

module.exports = seedDB;
