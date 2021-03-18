const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { response } = require('express')

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ name: 'theName', username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'testress',
      name: 'Tester Extrordinaire',
      password: 'laTestera'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  describe('when an invalid user is submitted', () => {
    test('when the username is missing', async () => {
      const usersAtStart = await helper.usersInDB()

      const missingUsername = {
        username: '',
        name: 'test user',
        password: '12345678'
      }

      await api
        .post('/api/users')
        .send(missingUsername)
        .expect(400)

      const usersAtEnd = await helper.usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('when the username has fewer than 3 chars', async () => {
      const usersAtStart = await helper.usersInDB()

      const shortUsername = {
        username: 'no',
        name: 'Joe No',
        password: 'jefferson'
      }

      await api
        .post('/api/users/')
        .send(shortUsername)
        .expect(400)

      const usersAtEnd = await helper.usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('when the password has fewer than 3 chars', async () => {
      const usersAtStart = await helper.usersInDB()

      const shortPassword = {
        username: 'aPerfectlyGoodUsername',
        name: 'noProblem',
        password: 'un'
      }

      await api
        .post('/api/users/')
        .send(shortPassword)
        .expect(400)

      const usersAtEnd = await helper.usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('when the password is missing', async () => {
      const usersAtStart = await helper.usersInDB()

      const missingPassword = {
        username: 'testUser',
        name: 'test user',
        password: ''
      }

      await api
        .post('/api/users')
        .send(missingPassword)
        .expect(400)

      const usersAtEnd = await helper.usersInDB()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})