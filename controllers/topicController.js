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

// const getArticleByTopic = (req, res, next) => {
//   console.log(req.params, '<<<<<<<<<<<<<<<<<');
//   const { topic } = req.params;
//   Article.find(topic)
//     .then(articles => {
//       res.status(200).send({ articles });
//     })
//     .catch(next);
// };

const getArticlesByTopic = (req, res, next) => {
  const { topic_name } = req.params;
  Article.find({ belongs_to: topic_name })
    .lean()
    .populate('created_by', 'username')
    .then(articleDocs => {
      return Promise.all(formatArticlesForClient(articleDocs));
    })
    .then(articles => {
      if (articles.length === 0)
        return next({
          status: 404,
          msg: 'articles not found: invalid topic name.'
        });
      res.send({ articles });
    })
    .catch(next);
};

module.exports = { getEndPoints, getTopics, getArticlesByTopic };
