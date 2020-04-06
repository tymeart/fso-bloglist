const config = require('./utils/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => { console.log('CONNECTED TO MONGODB') })
  .catch(error => { console.log('ERROR CONNECTING TO MONGODB:', error.message) });

app.use(cors());
app.use(bodyParser.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;