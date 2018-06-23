process.env.NODE_ENV = 'test';
const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const rawData = require('../seed/testData');
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');

describe('/northcoders-news', () => {
  let articleDocs;
  let commentDocs;
  let topicDocs;
  let userDocs;
  beforeEach(() => {
    return seedDB(rawData)
      .then(docs => {
        [articleDocs, topicDocs, userDocs, commentDocs] = docs;
      })
      .catch(console.log);
  });
  describe('/api', () => {
    describe('/', () => {
      it('GET responds with status 200 and an object containing available endpoints', () => {
        return request
          .get('/api')
          .expect(200)
          .then(res => {
            expect(res.body).to.eql({ status: 'ok' });
          });
      });
      describe('/api/topics', () => {
        describe('/', () => {
          it('GET responds with status 200 and an object containing all topic data', () => {
            return request
              .get('/api/topics')
              .expect(200)
              .then(res => {
                expect(res.body.topics[0]).to.include.keys(
                  '_id',
                  'title',
                  'slug'
                );
                expect(res.body.topics[0].slug).to.equal('mitch');
              });
          });
          describe('/api/topics/:topic/articles', () => {
            describe('/', () => {
              it('GET getArticleByTopic responds with status 200 and an object containing all topic data relating to the specific topic', () => {
                return request
                  .get('/api/topics/mitch/articles')
                  .expect(200)
                  .then(res => {
                    expect(res.body.articles.length).to.equal(2);
                    expect(res.body.articles[0]).to.include.keys(
                      'title',
                      'body',
                      'belongs_to',
                      'created_by'
                    );
                    expect(res.body.articles[0].belongs_to).to.equal('mitch');
                    expect(res.body.articles[1].belongs_to).to.equal('mitch');
                  });
              });
            });
          });
        });
      });
    });
  });
});
describe.only('/northcoders-news', () => {
  let articleDocs;
  let commentDocs;
  let topicDocs;
  let userDocs;
  beforeEach(() => {
    return seedDB(rawData)
      .then(docs => {
        [articleDocs, topicDocs, userDocs, commentDocs] = docs;
      })
      .catch(console.log);
  });
  describe('/api/articles', () => {
    describe('/', () => {
      it('GET responds with status 200 and returns all articles', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(res => {
            console.log(res.body, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<RESBOD');
            expect(res.body.articles.length).to.equal(4);
            expect(res.body.articles[0]).to.include.keys(
              'title',
              'body',
              'belongs_to',
              'created_by',
              'votes',
              '_id',
              '__v'
            );
          });
      });
      describe('/api/articles/:article_id/comments', () => {
        describe('/', () => {
          it('GET responds with status 200 and returns all comments for the requested article', () => {
            return request
              .get(`/api/articles/${articleDocs[0].id}/comments`)
              .expect(200)
              .then(res => {
                console.log(articleDocs, '<<<<<<<<<<<<<<<<<<<<<<<<<<BODY');
                expect(articleDocs.length).to.equal(4);
                expect(res.body.comments[0]).to.include.keys(
                  'created_at',
                  '_id',
                  '__v',
                  'body',
                  'belongs_to',
                  'created_by',
                  '__v'
                );
              });
          });
          describe('/api/articles/:article_id/comments', () => {
            describe('/', () => {
              it('POST adds a comment to the requested article', () => {
                return request
                  .post(`/api/articles/${articleDocs[0]._id}/comments`)
                  .send({
                    body: 'This is the new comment test',
                    belongs_to: 'Living in the shadow of a great man',
                    created_by: 'butter_bridge'
                  })
                  .expect(201)
                  .then(res => {
                    expect(res.body.comment).to.include.keys(
                      '_id',
                      'belongs_to',
                      'votes',
                      'body'
                    );
                    expect(res.body.comment.body).to.equal(
                      'This is the new comment test'
                    );
                  });
              });
              describe('/', () => {
                it('PUT Increment or Decrement the votes of an article by one', () => {
                  return request
                    .put(`/api/articles/${articleDocs[0]._id}`)
                    .send({
                      vote: 'up'
                    })
                    .expect(201)
                    .then(res => {
                      expect(res.body.articles[0]).to.equal(2);
                    });
                });
              });
            });
          });
        });
      });
    });
  });
});
