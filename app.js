const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const DB_URL = process.env.DB_URL || require('./config').DB_URL;

app.use(bodyParser.json());

app.use('/*', () => {
  res.status(404).send({ err: 'page not found' });
});

module.exports = app;
