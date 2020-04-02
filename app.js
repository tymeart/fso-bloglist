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

app.get('/api/blogs/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog.toJSON());
    } else {
      res.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

app.post('/api/blogs', async (req, res, next) => {
  if (req.body.url === undefined) {
    return res.status(400).json({ error: 'Url Missing' });
  }

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: 0
  });
  
  try {
    const savedBlog = await blog.save();
    res.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

app.delete('/api/blogs/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = app;