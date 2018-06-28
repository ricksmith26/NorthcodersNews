const {
  articleData,
  commentData,
  topicData,
  usersData
} = require('../seed/devData/index');
const seedDB = require('../seed/seed');
const DB_URL = require('../config/index');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const createUserOb = usersDocs => {
  return usersDocs.reduce(function(acc, val) {
    acc[val.username] = { id: val._id, name: val.name };
    return acc;
  }, {});
};

const changeArticleTopicId = (topicDocs, articleData, userRef) => {
  let result = [];

  for (let i = 0; i < articleData.length; i++) {
    for (let j = 0; j < topicDocs.length; j++) {
      if (articleData[i].topic === topicDocs[j].slug) {
        const art = {
          title: articleData[i].title,
          body: articleData[i].body,
          topic: topicDocs[j].id,
          created_by: userRef[articleData[i].created_by].id,
          belongs_to: topicDocs[j].slug,
          votes: articleData[i].votes
        };

        result.push(art);
      }
    }
  }

  return result;
};
const createArticleOb = articleData => {
  return articleData.reduce(function(acc, val) {
    acc[val.title] = val.id;
    return acc;
  }, {});
};

const changeCommentId = (userRef, commentData, articleDocs) => {
  let result = [];

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

  return result;
};

const commentCount = commentData.reduce((acc, val) => {
  if (acc[val.belongs_to] !== undefined) {
    acc[val.belongs_to]++;
  } else {
    acc[val.belongs_to] = 1;
  }
  return acc;
}, {});

module.exports = {
  changeArticleTopicId,
  createUserOb,
  changeCommentId,
  createArticleOb,
  createUserOb,
  commentCount
};
