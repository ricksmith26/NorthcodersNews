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
        });
      });
    });
  });
});
