#Northcoders-News

Getting Started

Follow these instructions to get your a copy of the project up and running on your computer for development and testing purposes.

#Installing

1.  Fork this repo to your own gitHub account

2.  Git clone (url of your fork) in the terminal.

3.  install prerequistites - see below

4.  set up config files - see config section below

5.  to test installation, open two terminal windows. in the first, run mongod in the second, run npm seed:dev. This will seed your dev database..

### Prerequisites

Install express, mongod, mongoose and nodemon to run on your computer.

## Running the tests

Simply type npm test in your command line to start the tests.

## Once git has been downloaded and dependacies have been installed open 2 command line windows in the northcoders news directory and run mongod in one and type npm run dev in the other. Once connected you can try out the below commands following localhost:9090/ in your browser or postman

## All below endpoints tests check the results to make sure they match http://northcoders-news-api.herokuapp.com/.

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
