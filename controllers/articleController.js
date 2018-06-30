const { Topic, Article, User, Comment } = require('../models');
const { commentCount, createUserOb, userOb } = require('../utils/index');

//GET /api/articles Return all the articles

const getArticles = (req, res, next) => {
  Promise.all([Comment.find(), User.find(), Article.find().lean()])
    .then(([comments, users, articles]) => {
      const Finalresult = articles.map(article => {
        return {
          ...article,
          comments: commentCount(comments)[article._id],
          created_by: userOb(users)[article.created_by]
        };
      });
      console.log();
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
      status: 404,
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

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([Article.find({ _id: article_id }), User.find().lean()])
    .then(([articleDoc, users]) => {
      const userObj = users.reduce((acc, user) => {
        if (acc[user._id] === undefined) {
          acc[user._id] = user.username;
          return acc;
        }
      }, {});

      const article = {
        ...articleDoc,
        comments: commentCount[articleDoc[0].title],
        created_by: userObj[articleDoc.created_by]
      };

      res.send({ article });
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getCommentsByArticleId,
  addComment,
  voteUpOrDown,

  getArticleById
};
