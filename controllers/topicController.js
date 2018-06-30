const { Topic, Article } = require('../models');

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};
//GET /api/topics/:topic/articles Return all the articles for a certain topic

const getArticleByTopic = (req, res, next) => {
  const { topic_name } = req.params;
  Article.find({ belongs_to: topic_name })
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

const addNewArticleToTopic = (req, res, next) => {
  const { topic_name } = req.params;
  const { title, body, created_by } = req.body;
  const article = new Article({
    title,
    body,
    created_by,
    belongs_to: topic_name
  });
  article
    .save()
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};

module.exports = { addNewArticleToTopic, getTopics, getArticleByTopic };
