const commentRouter = require('express').Router();

const {
  voteComment,
  getComments,
  deleteComment
} = require('../controllers/topicController');

commentRouter.route('/').get(getComments);

commentRouter
  .route('/:comment_id')
  .put(voteComment)
  .delete(deleteComment);

module.exports = commentRouter;
