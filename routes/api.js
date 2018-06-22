const apiRouter = require('express').Router();
const topicsRouter = require('./topic');
const articleRouter = require('./article');
const commentRouter = require('./comment');

const { getEndPoints } = require('../controllers/topicController');

apiRouter.route('/').get(getEndPoints);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;
