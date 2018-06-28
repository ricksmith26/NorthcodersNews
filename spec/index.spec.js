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
    return seedDB(rawData).then(docs => {
      [articleDocs, topicDocs, userDocs, commentDocs] = docs;
    });
  });
  describe('GET /api/topics', () => {
    it('GET  responds with status 200 and an object containing all topic data', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.include.keys('_id', 'title', 'slug');
          expect(res.body.topics[0].slug).to.equal('mitch');
        });
    });
    describe('GET /api/topics/:topic/articles', () => {
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
  describe('GET /api/articles', () => {
    it('GET responds with status 200 and returns all articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]).to.include.keys(
            'title',
            'body',
            'belongs_to',
            'created_by',
            'votes',
            '_id',
            'comments',
            '__v'
          );
        });
    });

    describe('GET /api/articles/:article_id/comments', () => {
      it('GET responds with status 200 and returns all comments for the requested article', () => {
        return request
          .get(`/api/articles/${articleDocs[0].id}/comments`)
          .expect(200)
          .then(res => {
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

      describe('POST /api/articles/:article_id/comments', () => {
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
              expect(res.body).to.include.keys('comment');
              expect(res.body.comment.body).to.equal(
                'This is the new comment test'
              );
            });
        });
        describe('PUT /api/articles/:article_id/comments', () => {
          it('PUT Increment or Decrement the votes of an article by one', () => {
            return request
              .put(`/api/articles/${articleDocs[0]._id}`)
              .send({ vote: 'up' })
              .expect(201)
              .then(res => {
                expect(res.body.votes).to.equal(1);
              });
          });
        });
      });
    });
    describe('GET /api/comments', () => {
      it('GET responds with status 200 and returns all comments', () => {
        return request
          .get('/api/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comments.length).to.equal(8);
          });
      });
      describe('PUT /api/comments/:comment_id', () => {
        it('PUT Increment or Decrement the votes of a comment by one', () => {
          return request
            .put(`/api/comments/${commentDocs[0]._id}`)
            .send({ vote: 'up' })
            .expect(201)
            .then(res => {
              expect(res.body.voted.votes).to.equal(8);
            });
        });
        describe('DELETE /api/comments/:article_id', () => {
          it('DELETE Deletes the requested comment and confirms with status 201 and a message', () => {
            return request
              .delete(`/api/comments/${articleDocs[0]._id}`)
              .expect(201)
              .then(res => {
                expect(res.body).to.eql({
                  message: `Comment Id ${articleDocs[0]._id} has been deleted`
                });
              });
          });
        });
      });
      describe('GET /api/users/:username', () => {
        it('GET responds with status 200 and returns the requested user profile', () => {
          return request
            .get(`/api/users/butter_bridge`)
            .expect(200)
            .then(res => {
              expect(res.body[0]).to.include.keys(
                '_id',
                'username',
                'name',
                'avatar_url'
              );
            });
        });
      });
    });

    describe('GET /api/topics/:topic/articles', () => {
      it('GET ERRORS get articles by topic, responds with a specific message', () => {
        return request
          .get(`/api/topics/:topic/articles`)
          .expect(404)
          .then(res => {
            expect(res.clientError).to.equal(true);
            expect(res.notFound).to.equal(true);
            expect(res.accepted).to.equal(false);
          });
      });

      describe('GET /api/articles/:article_id/comments', () => {
        it('GET ERRORS get comments by article id, responds with a specific message', () => {
          return request
            .get(`/api/articles/hiwvriunr56/comments`)
            .expect(404)
            .then(res => {
              expect(res.body.message).of.equal(
                'Cast to ObjectId failed for value "hiwvriunr56" at path "belongs_to" for model "comments"'
              );
            });
        });
        describe('POST /api/articles/:article_id/comments', () => {
          it('POST ERROR  adds a comment to the requested article, return the correct specific error', () => {
            return request
              .post(`/api/articles/sjivsdds56/comments`)
              .send({
                body: 'This is the new comment test',
                belongs_to: 'Living in the shadow of a great man',
                created_by: 'butter_bridge'
              })
              .expect(404)
              .then(res => {
                expect(res.body.message).of.equal(
                  'comments validation failed: belongs_to: Cast to ObjectID failed for value "Living in the shadow of a great man" at path "belongs_to", created_by: Cast to ObjectID failed for value "butter_bridge" at path "created_by"'
                );
              });
          });
          describe('PUT /api/articles/:article_id/comments', () => {
            it('PUT ERROR Increment or Decrement the votes of an article by one, returns the correct error', () => {
              return request
                .put(`/api/articles/${articleDocs[0]._id}`)
                .send({ vote: 'no' })
                .expect(404)
                .then(res => {
                  expect(res.body.message).to.eql(
                    'Query error! Vote must be either up or down'
                  );
                });
            });
            describe('PUT /api/comments/:comment_id', () => {
              it('PUT ERROR Increment or Decrement the votes of a comment by one, returns the correct error message', () => {
                return request
                  .put(`/api/comments/acauaiuinauN`)
                  .send({
                    vote: 'YES'
                  })
                  .expect(404)
                  .then(res => {
                    expect(res.body.message).to.equal(
                      'Query error! Vote must be up or down'
                    );
                  });
              });
              describe('DELETE /api/comments/:article_id', () => {
                it('DELETE  ERROR Deletes the requested comment, returns a bespoke error message', () => {
                  return request
                    .delete(`/api/comments/5a515ef511f1zf`)
                    .expect(404)
                    .then(res => {
                      expect(res.body.message).to.eql(
                        'Cast to ObjectId failed for value "{ _id: \'5a515ef511f1zf\' }" at path "_id" for model "comments"'
                      );
                    });
                });
                describe('GET /api/users/:username', () => {
                  it('GET responds with status 200 and returns the requested user profile', () => {
                    return request
                      .get(`/api/users/cunqc59c59w`)
                      .expect(404)
                      .then(res => {
                        expect(res.body.message).to.eql('Incorrect username');
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
});
