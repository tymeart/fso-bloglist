const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

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

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body.length).toBe(initialBlogs.length);
});

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');
  const blogTitles = response.body.map(blog => blog.title);
  expect(blogTitles).toContain('Relearning math');
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Rise of reusables',
    author: 'Nat',
    url: 'http://natsblog.com',
    likes: 2
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const contents = response.body.map(blog => blog.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContain('Rise of reusables');
});
afterAll(() => mongoose.connection.close());