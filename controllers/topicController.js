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

module.exports = { getEndPoints, getTopics };
