const topicsRouter = require('express').Router();
const {
  getTopics,
  getArticleByTopic,
  addNewArticleToTopic
} = require('../controllers/topicController');

topicsRouter.route('/').get(getTopics);

topicsRouter
  .route('/:topic_name/articles')
  .get(getArticleByTopic)
  .post(addNewArticleToTopic);
module.exports = topicsRouter;
