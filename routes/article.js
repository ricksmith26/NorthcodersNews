const articleRouter = require('express').Router();

const {
  getArticles,
  getCommentsByArticleId,
  addComment,
  voteUpOrDown
} = require('../controllers/topicController');

articleRouter.route('/').get(getArticles);

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(addComment);

articleRouter.route('/:article_id').put(voteUpOrDown);

module.exports = articleRouter;
