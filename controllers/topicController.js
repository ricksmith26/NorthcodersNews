const { Topic, Article, User, Comment } = require('../models');

const getEndPoints = (req, res, next) => {
  const result = { status: 'ok' };
  res.send(result);
};

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

const getArticleByTopic = (req, res, next) => {
  const { topic_name } = req.params;
  Article.find({ belongs_to: topic_name })
    .then(articles => {
      if (articles.length === 0)
        return next({
          status: 404,
          msg: 'articles not found: invalid topic name.'
        });
      console.log(articles, '<<<<<<<<<<<<');
      res.send({ articles });
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Comment.find({ belongs_to: article_id })
    .then(comments => {
      console.log({ comments });
      res.send({ comments });
    })
    .catch(next);
};

const addComment = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id, '<<<<<<<<<<<<<<<<');
  const username = req.body.created_by;
  Promise.all([
    Article.find({ article: article_id }),
    User.findOne({ username: username })
  ])
    .then(([article, user]) => {
      if (user === null || article === null) {
        return next({
          status: 400,
          message:
            'Invalid user input! Not recognised input in created_by or belongs_to fields'
        });
      }
      const newComment = new Comment(req.body);
      newComment.belongs_to = article_id;
      newComment.created_by = user._id;
      return newComment.save().then(comment => {
        return res.status(201).send({ comment });
      });
    })
    .catch(next);
};

const voteUpOrDown = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.body;
  if (vote !== 'up' && vote !== 'down')
    return next({
      status: 200,
      message: 'Query error! Vote must be either up or down'
    });
  let voter;
  vote === 'up' ? (voter = 1) : (voter = -1);
  Article.findByIdAndUpdate(
    article_id,
    { $inc: { votes: voter } },
    { new: true }
  )
    .then(voted => {
      res.status(201).send({ voted });
    })
    .catch(next);
};

const getComments = (req, res, next) => {
  Comment.find()
    .then(comment => {
      res.send({ comment });
    })
    .catch(next);
};

const voteComment = (req, res, next) => {
  console.log('hit function');
  const { comment_id } = req.params;
  const { vote } = req.body;
  if (vote !== 'up' && vote !== 'down')
    return next({
      status: 200,
      message: 'Query error! Vote must be up or down'
    });
  let voter;
  vote === 'up' ? (voter = 1) : (voter = -1);
  Comment.findByIdAndUpdate(
    comment_id,
    { $inc: { votes: voter } },
    { new: true }
  )
    .then(voted => {
      console.log(voted, comment_id);
      res.status(201).send({ voted });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove({
    _id: comment_id
  })
    .then(deleted => {
      res.status(201).send(deleted);
    })
    .catch(next);
};

module.exports = {
  getEndPoints,
  getTopics,
  getArticleByTopic,
  getArticles,
  getCommentsByArticleId,
  addComment,
  voteUpOrDown,
  voteComment,
  getComments,
  deleteComment
};
