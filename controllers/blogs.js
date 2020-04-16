const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    console.log(blog)
    if (blog) {
      res.json(blog.toJSON());
    } else {
      res.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  if (req.body.url === undefined) {
    return res.status(400).json({ error: 'Url Missing' });
  }

  const user = await User.findById(req.body.user);

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: 0,
    user: user._id
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  const updatedBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  };

  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true });
    await blog.save();
    res.json(blog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;