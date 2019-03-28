const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');

const routes = require('./routes');

const app = express();


if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
  app.set('db_path', path.join(__dirname, 'db', 'rules'));
} else
  app.set('db_path', path.join(__dirname, 'db', 'test', 'rules'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({error: err.message});
});

module.exports = app;
