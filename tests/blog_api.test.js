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

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  
  test('all blogs are returned', async () => {
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
  
  test('a specific blog is within the returned blogs', async () => {
    const blogsAtEnd = await helper.blogsInDb();
    const blogTitles = blogsAtEnd.map(blog => blog.title);
    expect(blogTitles).toContain('Relearning math');
  });
});

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  
    expect(resultBlog.body).toEqual(blogToView);
  });
  
  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404);
  });

  test('fails with statuscode 400 if id is not valid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400);
  });
});

describe('addition of a new blog', () => {
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
  
  test('fails with statuscode 400 if data invalid', async () => {
    const newBlog = {};
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('updating a blog', () => {
  test('succeeds with statuscode 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const newBlogInfo = {
      title: 'HTML is NOT so easy',
      author: 'Ted Blue',
      url: 'http://tedblue.com',
      likes: 3
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlogInfo)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].title).toBe(newBlogInfo.title);
    expect(blogsAtEnd[0].likes).toBe(newBlogInfo.likes);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with a statuscode of 204 if id is valid', async () => {
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
});

afterAll(() => mongoose.connection.close());