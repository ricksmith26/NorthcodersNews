const {
  articleData,
  commentData,
  topicData,
  usersData
} = require('../seed/testData/index');
const seedDB = require('../seed/seed');
const DB_URL = require('../config/index');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const createUserOb = usersDocs => {
  // console.log(usersDocs, '<<<<<<<<HERE');
  return usersDocs.reduce(function(acc, val) {
    // console.log(val.name, val._id, '<<<<VAL');
    acc[val.username] = { id: val._id, name: val.name };
    return acc;
  }, {});
};

const changeArticleTopicId = (topicDocs, articleData, userRef) => {
  let result = [];

  for (let i = 0; i < articleData.length; i++) {
    for (let j = 0; j < topicDocs.length; j++) {
      if (articleData[i].topic === topicDocs[j].slug) {
        // console.log(articleData[i], '<><><><>><>><>><><><>');
        const art = {
          title: articleData[i].title,
          body: articleData[i].body,
          topic: topicDocs[j].id,
          belongs_to: topicDocs[j].slug, // votes: articleData[i].votes,
          created_by: userRef[articleData[i].created_by].id
        };
        // console.log(art, 'here???????????????<<<<<<<<<<<<<<<<<<<<<<');
        result.push(art);
      }
    }
  }
  // console.log(result, 'changeArticle');
  console.log(result);
  return result;
};
const createArticleOb = articleData => {
  console.log(articleData);
  //CREATE THIS
  return articleData.reduce(function(acc, val) {
    acc[val.title] = val.id;
    return acc;
  }, {});
};

//need to create a article title look up
const changeCommentId = (userRef, commentData, articleDocs) => {
  let result = [];
  // console.log(commentData, '<<<<<<<<<<<<<<<<<<<<<<<<overhere');
  for (let i = 0; i < commentData.length; i++) {
    const com = {
      body: commentData[i].body,
      belongs_to: createArticleOb(articleDocs)[commentData[i].belongs_to],
      created_at: commentData[i].created_at,
      votes: commentData[i].votes,
      created_by: userRef[commentData[i].created_by].id
    };

    result.push(com);
  }
  // console.log(result, 'chanegComment');
  return result;
};

module.exports = {
  changeArticleTopicId,
  createUserOb,
  changeCommentId,
  createArticleOb
};
