# Northcoder News

In this project I will expore the use of mongodb in the making of a Northcoders news api, users will be able to complete various GET, PUT, POST and DELETE functions on a range of 4 schemas.

## Getting Started

After making a parent folder git clone the following link: https://github.com/ricksmith26/BE-FT-northcoders-news.git

### Prerequisites

Install express, mongod and nodemon to run on your computer.

### Installing

Once git has been downloaded and dependacies have been installed open 2 command line windows in the northcoders news directory and run mongod in one and type npm run dev in the other. Once connected you can try out the below commands following localhost:9090/ in your browser or postmand

## Running the tests

Simply type npm test in your command line to start the tests.

### All below endpoints tests check the results to make sure they match http://northcoders-news-api.herokuapp.com/.

Give an example

```
Northcoders News
API Endpoints
GET /api/topics

Get all the topics

GET /api/topics/:topic/articles
Return all the articles for a certain topic

GET /api/articles
Returns all the articles

GET /api/articles/:article_id/comments
Get all the comments for a individual article

POST /api/articles/:article_id/comments
Add a new comment to an article. This route requires a JSON body with a comment key and value pair
e.g: {"comment": "This is my new comment"}

PUT /api/articles/:article_id
Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: http://northcoders-news-api.herokuapp.com/api/articles/:article_id?vote=up

PUT /api/comments/:comment_id
Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: http://northcoders-news-api.herokuapp.com/api/comments/:comment_id?vote=down

DELETE /api/comments/:comment_id
Deletes a comment if the comment was created by the Northcoder user

GET /api/users/:username
Returns a JSON object with the profile data for the specified user.
```
