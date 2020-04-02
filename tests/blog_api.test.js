const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test.only('the unique identifier of a blog is named id', async () => {
  const blogs = await helper.blogsInDb();
  const oneBlog = blogs[0];
  expect(oneBlog.id).toBeDefined();
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

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  
  const contents = blogsAtEnd.map(blog => blog.title);
  expect(contents).toContain('Rise of reusables');
});

test('blog without content is not added', async () => {
  const newBlog = {};

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(resultBlog.body).toEqual(blogToView);
});

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const contents = blogsAtEnd.map(blog => blog.title);
  expect(contents).not.toContain(blogToDelete.title);
});

afterAll(() => mongoose.connection.close());