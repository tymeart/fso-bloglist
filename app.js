const config = require('./utils/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => { console.log('CONNECTED TO MONGODB') })
  .catch(error => { console.log('ERROR CONNECTING TO MONGODB:', error.message) });

app.use(cors());
app.use(bodyParser.json());

app.get('/api/blogs', (req, res) => {
  Blog
    .find({})
    .then(blogs => res.json(blogs));
});

app.post('/api/blogs', (req, res) => {
  if (req.body.content === undefined) {
    return response.status(400).json({ error: 'Content Missing' });
  }

  const blog = new Blog(req.body);
  blog
    .save()
    .then(result => res.status(201).json(result));
});