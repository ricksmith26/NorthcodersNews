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

app.set('view engine', 'ejs');

app.use('/api', apiRouter);

app.use('/*', (req, res) => {
  res.status(404).send({ err: 'page not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'CastError')
    res.status(404).send({
      message: err.message
    });
  else if (err.name === 'ValidationError')
    res.status(404).send({ message: err.message });
  else if (err.status === 200) res.status(200).send({ message: err.message });
  else if (err.status === 404) res.status(404).send({ message: err.message });
  else if (err.status === 400) res.status(400).send({ message: err.message });
  else if (err.status === 500) res.status(500).send({ message: err.message });
  else res.status(500).send({ message: 'Internal server error!' });
});

module.exports = app;
