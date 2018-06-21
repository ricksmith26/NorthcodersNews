const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topicController');

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter;
