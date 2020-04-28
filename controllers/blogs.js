const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = req => {
  // get the token from the authorization header
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7);
  }
  return null;
}

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 });
  res.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.get('/:id', async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  console.log(blog)
  if (blog) {
    res.json(blog.toJSON());
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', async (req, res, next) => {
  if (req.body.url === undefined) {
    return res.status(400).json({ error: 'URL Missing' });
  }

  // token contains username & id of user who made the request
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: 0,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.json(savedBlog.toJSON());
});

blogsRouter.put('/:id', async (req, res, next) => {
  const updatedBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  };

  const blog = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true });
  await blog.save();
  res.json(blog.toJSON());
});

blogsRouter.delete('/:id', async (req, res, next) => {
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;