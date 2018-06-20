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

mongoose.connect('mongodb://localhost:27017/northcoder_news').then(() => {
  seedDB(topicData, usersData);
});

const changeArticeTopicId = (articleData, topicDocs) => {
  let result = [];
  for (let i = 0; i < articleData.length; i++) {
    for (let j = 0; j < topicDocs.length; j++) {
      if (articleData[i].topic === topicDocs[j].slug) {
        articleData[i].topic = topicDocs[j].slug;
        result.push(articleData[i]);
      }
    }
  }
  return result;
};

seedDB(topicData, articleData);

module.exports = { changeArticeTopicId };
