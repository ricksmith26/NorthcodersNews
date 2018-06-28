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
  describe('/api/topics', () => {
    it('GET responds with status 200 and an object containing all topic data', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.include.keys('_id', 'title', 'slug');
          expect(res.body.topics[0].slug).to.equal('mitch');
        });
    });
    describe('/api/topics/:topic/articles', () => {
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

      describe('/api/articles', () => {
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

        describe('/api/articles/:article_id/comments', () => {
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

          describe('/api/articles/:article_id/comments', () => {
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
            describe('/api/articles/:article_id/comments', () => {
              it('PUT Increment or Decrement the votes of an article by one', () => {
                return request
                  .put(`/api/articles/${articleDocs[0]._id}`)
                  .send({ vote: 'up' })
                  .expect(201)
                  .then(res => {
                    expect(res.body.votes).to.equal(1);
                  });
              });

              describe('/api/comments', () => {
                it('GET responds with status 200 and returns all comments', () => {
                  return request
                    .get('/api/comments')
                    .expect(200)
                    .then(res => {
                      expect(res.body.comments.length).to.equal(8);
                    });
                });
                describe('/api/comments/:comment_id', () => {
                  it('PUT Increment or Decrement the votes of a comment by one', () => {
                    return request
                      .put(`/api/comments/${commentDocs[0]._id}`)
                      .send({ vote: 'up' })
                      .expect(201)
                      .then(res => {
                        expect(res.body.voted.votes).to.equal(8);
                      });
                  });
                  describe('/', () => {
                    it('DELETE Deletes the requested comment and confirms with status 201 and a message', () => {
                      return request
                        .delete(`/api/comments/${articleDocs[0]._id}`)
                        .expect(201)
                        .then(res => {
                          expect(res.body).to.eql({
                            message: `Comment Id ${
                              articleDocs[0]._id
                            } has been deleted`
                          });
                        });
                    });

                    describe('/api/users/:username', () => {
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
                    describe('/api/topics/:topic/articles', () => {
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
                      //write this test
                      describe('/api/articles/:article_id/comments', () => {
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
                        describe.only('/api/articles/:article_id/comments', () => {
                          it('POST adds a comment to the requested article', () => {
                            return request
                              .post(`/api/articles/sjivsdds56/comments`)
                              .send({
                                body: 'This is the new comment test',
                                belongs_to:
                                  'Living in the shadow of a great man',
                                created_by: 'butter_bridge'
                              })
                              .expect(500)
                              .then(res => {
                                console.log(res.clientError);
                                expect(res.body.message).of.equal(
                                  'Cast to ObjectId failed for value "sjivsdds56" at path "belongs_to" for model "comments"'
                                );
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
      });
    });
  });
});
