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

const changeArticleTopicId = (articleData, topicDocs) => {
  let result = [];
  for (let i = 0; i < articleData.length; i++) {
    for (let j = 0; j < topicDocs.length; j++) {
      if (articleData[i].topic === topicDocs[j].slug) {
        const art = {
          title: articleData[i].title,
          topic: topicDocs[j].id,
          created_by: articleData[i].title,
          body: articleData[i].body
        };

        result.push(art);
      }
    }
  }
  return result;
};

module.exports = changeArticleTopicId;
