const { User, Article, Comment, Topic } = require('../models/index');
const mongoose = require('mongoose');
const {
  articleData,
  commentData,
  topicData,
  usersData
} = require('./testData/index');
const {
  changeArticleTopicId,
  createUserOb,
  changeCommentId,
  createArticleOb
} = require('../utils/index');

const seedDB = (topicData, articleData, commentData, usersData) => {
  let articleDocs;
  return (
    mongoose.connection
      .dropDatabase()
      .then(() => {
        // console.log(topicData, '<<<<<<<<<<<<topicData');
        console.log('b4 insert');
        return Promise.all([
          Topic.insertMany(topicData),
          User.insertMany(usersData)
        ]);
      })
      ///the below was working before I added the create userOb with console
      //log but won't allow as a parameter
      .then(([topicDocs, userDocs]) => {
        const userRef = createUserOb(userDocs);
        // console.log(userRef, '+++++++++++=');
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
        const articleIdOb = createArticleOb(articleDocs);
        // console.log(
        //   articleDocs,
        //   '<<<<<<<<<<<<<<ARTICLE>>>>>>>>>.....',
        //   commentData,
        //   '**NEXTUSERDOCS***',
        //   userRef,
        //   '<<<USERDOCS COMMENTDATA'
        // );

        return Comment.insertMany(
          changeCommentId(userRef, commentData, articleDocs)
        );
      })

      .then(console.log)
      .catch(console.log)
  );
};

module.exports = seedDB;
