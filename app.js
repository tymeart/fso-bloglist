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

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs.map(blog => blog.toJSON()));
});

app.post('/api/blogs', (req, res) => {
  if (req.body.url === undefined) {
    return res.status(400).json({ error: 'Url Missing' });
  }

  const blog = new Blog(req.body);
  blog
    .save()
    .then(result => res.status(200).json(result));
});

module.exports = app;