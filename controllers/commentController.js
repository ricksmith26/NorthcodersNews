const { Topic, Article, User, Comment } = require('../models');

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
      status: 404,
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

module.exports = { deleteComment, voteComment, getComments };
