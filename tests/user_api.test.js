const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('secret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'treeplanter',
      name: 'Tricia',
      password: 'plantallthetrees'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test.only('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'planting'
    };

    try {
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);
      expect(result.body.error).toContain('`username` to be unique');
    } catch (err) {
      next(err)
    }

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close()
});