const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Ted Blue',
    url: 'http://tedblue.com',
    likes: 1
  },
  {
    title: 'Relearning math',
    author: 'Peggy',
    url: 'http://peggywrites.com',
    likes: 3
  }
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovesoon' });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
}

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
}

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
}

module.exports = { 
  initialBlogs, 
  nonExistingId, 
  blogsInDb,
  usersInDb
};