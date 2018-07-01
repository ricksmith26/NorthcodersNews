const {
  articleData,
  commentData,
  topicData,
  usersData
} = require('../seed/devData/index');

//createUserOb to create object for seeding

const createUserOb = usersDocs => {
  return usersDocs.reduce(function(acc, val) {
    acc[val.username] = { id: val._id, name: val.name };
    return acc;
  }, {});
};

//userOb for getArticles

const userOb = users =>
  users.reduce(function(acc, val) {
    if (acc[val.id] === undefined) {
      acc[val.id] = val.username;
      return acc;
    }
  }, {});

//commentCount for getArticles

const commentCount = comments =>
  comments.reduce((acc, val) => {
    if (acc[val.belongs_to] !== undefined) {
      acc[val.belongs_to]++;
    } else {
      acc[val.belongs_to] = 1;
    }
    return acc;
  }, {});

//changeArticleTopicId for seedinng

const changeArticleTopicId = (topicDocs, articleData, userRef) => {
  return articleData.reduce(function(acc, article) {
    for (let i = 0; i < topicDocs.length; i++) {
      if (article.topic === topicDocs[i].slug) {
        const art = {
          title: article.title,
          body: article.body,
          topic: topicDocs[i].id,
          created_by: userRef[article.created_by].id,
          belongs_to: topicDocs[i].slug
        };

        acc.push(art);
      }
    }
    return acc;
  }, []);
};

//createArticleOb for seeding

const createArticleOb = articleData => {
  return articleData.reduce(function(acc, val) {
    acc[val.title] = val.id;
    return acc;
  }, {});
};

//changeCommentId for seeding

const changeCommentId = (userRef, commentData, articleDocs) => {
  return commentData.reduce(function(acc, comment) {
    acc.push({
      body: comment.body,
      belongs_to: createArticleOb(articleDocs)[comment.belongs_to],
      created_at: comment.created_at,
      votes: comment.votes,
      created_by: userRef[comment.created_by].id
    });
    return acc;
  }, []);
};

module.exports = {
  changeArticleTopicId,
  createUserOb,
  changeCommentId,
  createArticleOb,
  commentCount,
  userOb
};
