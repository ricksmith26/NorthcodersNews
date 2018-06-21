const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const DB_URL = process.env.DB_URL || require('./config').DB_URL;

mongoose.connect(DB_URL).then(() => {
  console.log(`connected to database on ${DB_URL}...`);
});

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send({ msg: 'welcome...' });
});

app.use('/api', apiRouter);

app.use('/*', () => {
  res.status(404).send({ err: 'page not found' });
});

module.exports = app;
