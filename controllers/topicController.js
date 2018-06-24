const { Topic, Article, User, Comment } = require('../models');

const getEndPoints = (req, res, next) => {
  const result = { status: 'ok' };
  // res.render('pages/apiList');
  res.send(result);
};

//GET /api/topics Get all the topics

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

//GET /api/articles Return all the articles

const getArticles = (req, res, next) => {
  Promise.all([Comment.find(), User.find(), Article.find().lean()])
    .then(([comments, users, articles]) => {
      const commentCount = comments.reduce((acc, val) => {
        if (acc[val.belongs_to] !== undefined) {
          acc[val.belongs_to]++;
        } else {
          acc[val.belongs_to] = 1;
        }
        return acc;
      }, {});

      const userOb = users.reduce(function(acc, val) {
        if (acc[val.id] === undefined) {
          acc[val.id] = val.username;
          return acc;
        }
      }, {});
      const Finalresult = articles.map(article => {
        return {
          ...article,
          comments: commentCount[article._id],
          created_by: userOb[article.created_by]
        };
      });
      res.status(200).send({ articles: Finalresult });
    })
    .catch(next);
};

//GET /api/articles/:article_id/comments Get all the comments for a individual article

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Comment.find({ belongs_to: article_id })
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};

// POST / api / articles /: article_id / comments Add a new comment to an article.This route requires a JSON body with a comment key and value pair e.g: { "comment": "This is my new comment" }

const addComment = (req, res, next) => {
  const { article_id } = req.params;
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

// PUT / api / articles /: article_id Increment or Decrement the votes of an article by one.This route requires a vote query of 'up' or 'down' e.g: https://nc-news-portfolio.herokuapp.com/api/articles/:article_id?vote=up

const voteUpOrDown = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.body;
  if (vote !== 'up' && vote !== 'down')
    return next({
      status: 200,
      message: 'Query error! Vote must be either up or down'
    });

  let voteReq;
  if (vote === 'up') {
    voteReq = 1;
  } else {
    voteReq = -1;
  }
  Article.findByIdAndUpdate(
    article_id,
    { $inc: { votes: voteReq } },
    { new: true }
  )
    .then(voted => {
      res.status(201).send(voted);
    })
    .catch(next);
};

//I added this so i could easily get the comments id's

const getComments = (req, res, next) => {
  Comment.find()
    .then(comments => {
      res.send({ comments });
    })

    .catch(next);
};

// PUT / api / comments /: comment_id Increment or Decrement the votes of a comment by one.This route requires a vote query of 'up' or 'down' e.g: https://nc-news-portfolio.herokuapp.com/api/comments/:comment_id?vote=down

const voteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.body;
  if (vote !== 'up' && vote !== 'down')
    return next({
      status: 200,
      message: 'Query error! Vote must be up or down'
    });
  let voteReq = 0;
  if (vote === 'up') {
    voteReq++;
  } else {
    voteReq--;
  }
  Comment.findByIdAndUpdate(
    comment_id,
    { $inc: { votes: voteReq } },
    { new: true }
  )
    .then(voted => {
      res.status(201).send({ voted });
    })
    .catch(next);
};

// DELETE / api / comments /: comment_id Deletes a comment if the comment was created by the Northcoder user

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove({
    _id: comment_id
  })
    .then(() => {
      res.status(201).send({
        message: `Comment Id ${comment_id} has been deleted`
      });
    })
    .catch(next);
};

// GET / api / users /: username Returns a JSON object with the profile data for the specified user.

const getUserProfile = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(user => {
      res.send(user);
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
  deleteComment,
  getUserProfile
};
