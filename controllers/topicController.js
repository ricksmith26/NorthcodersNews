const { Topic, Article, User, Comment } = require('../models');

const getEndPoints = (req, res, next) => {
  const result = { status: 'ok' };
  res.send(result);
};

const getTopics = (req, res, next) => {
  console.log('hit');
  Topic.find()
    .then(topics => {
      console.log('hit2');
      res.send({ topics });
    })
    .catch(next);
};
// I have writte mth below but have not written an api or test
// const getArticleByTopicId = (req, res, next) => {
//   const { topic } = req.params;
//   Article.find(topic).then(articles => {
//     res.status(200).send({ articles });
//   });
// };

module.exports = { getEndPoints, getTopics, getArticleByTopicId };
