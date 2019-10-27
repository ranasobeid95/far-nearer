const express = require('express');
const { join } = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');

const controllers = require('./controllers');
const { errorHandle } = require('./controllers/middlewars');

const app = express();

app.disable('x-powered-by');
app.set('port', process.env.PORT || 5000);

app.use(express.json());
app.use(compression());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/', controllers);

app.use(express.static(join(__dirname, '..', 'client', 'build')));

app.use((_req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'build', 'index.html'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  res.send({ statusCode: err.statusCode, error: errorHandle(err.statusCode) });
});

module.exports = app;
