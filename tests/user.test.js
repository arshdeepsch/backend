const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')

describe('when one user is in the db', () => {
  beforeAll(async () => {
    await User.deleteMany({})
    const pass = await bcrypt.hash('test', 10)
    await new User({
      username: 'root',
      passHash: pass
    }).save()
  })

  test('add a new user', async () => {
    const initalUsers = await helper.usersInDb()
    const newUser = {
      username: 'new user test',
      password: 'testpass'
    }
    await api.post('/api/users').send(newUser).expect(201)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(initalUsers.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})