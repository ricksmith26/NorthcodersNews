const apiRouter = require('express').Router();
const topicsRouter = require('./topic');
const articleRouter = require('./article');
const commentRouter = require('./comment');
const { getUserProfile } = require('../controllers/userController');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

apiRouter.use('/comments', commentRouter);

apiRouter.get('/users/:username', getUserProfile);

apiRouter.use('/', (req, res, next) => {
  res.sendFile(__dirname + '/apiList.html');
});
module.exports = apiRouter;
