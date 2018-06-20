const { User, Article, Comment, Topic } = require('../models/index');
const mongoose = require('mongoose');
const {
  articleData,
  commentData,
  topicData,
  usersData
} = require('./testData/index');
const { changeArticleTopicId, createUserOb } = require('../utils/index');

const seedDB = (articleData, commentData, topicData, usersData) => {
  console.log(topicData, '<<<<<<<<<<<<topicData');
  return (
    mongoose.connection
      .dropDatabase()
      .then(() => {
        console.log('b4 insert');
        return Promise.all([
          Topic.insertMany(topicData),
          User.insertMany(usersData)
        ]);
      })
      ///the below was working before I added the create userOb with console
      //log but won't allow as a parameter
      .then(([topicDocs, userDocs]) => {
        console.log(userDocs, '<<<<@@@@');
        console.log(topicDocs, '<<<<@@@@TOPICDOC');
        return Promise.all([
          createUserOb(usersDocs),
          changeArticleTopicId(articleData, topicDocs)
        ]);
      })

      .then(console.log)
      .catch(console.log)
  );
};

module.exports = seedDB;
