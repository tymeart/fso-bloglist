require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});