const topicsRouter = require('express').Router();
const {
  getTopics,
  getArticleByTopic
} = require('../controllers/topicController');

topicsRouter.route('/').get(getTopics);

topicsRouter.route('/:topic_name/articles').get(getArticleByTopic);

module.exports = topicsRouter;
