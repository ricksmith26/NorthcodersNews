const apiRouter = require('express').Router();
const topicsRouter = require('./topic');

const { getEndPoints } = require('../controllers/topicController');

apiRouter.route('/').get(getEndPoints);

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
