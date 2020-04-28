const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

logger.info('Connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => { logger.info('CONNECTED TO MONGODB') })
  .catch(error => { logger.error('ERROR CONNECTING TO MONGODB:', error.message) });

app.use(cors());
app.use(bodyParser.json());
app.use(middleware.requestLogger);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;