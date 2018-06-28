const { User, Article, Comment, Topic } = require('../models/index');
const mongoose = require('mongoose');
const {
  articleData,
  commentData,
  topicData,
  usersData
} = require('./devData/index');

const {
  changeArticleTopicId,
  createUserOb,
  changeCommentId,
  createArticleOb
} = require('../utils');

const seedDB = ({ topicData, articleData, commentData, usersData }) => {
  let articleDocs;
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(usersData)
      ]);
    })

    .then(([topicDocs, userDocs]) => {
      const userRef = createUserOb(userDocs);

      return Promise.all([
        Article.insertMany(
          changeArticleTopicId(topicDocs, articleData, userRef)
        ),
        topicDocs,
        userDocs,
        userRef
      ]);
    })

    .then(([articleDocs, topicDocs, userDocs, userRef]) => {
      return Promise.all([
        articleDocs,
        topicDocs,
        userDocs,
        Comment.insertMany(changeCommentId(userRef, commentData, articleDocs))
      ]);
    })
    .catch(console.log);
};

module.exports = seedDB;
