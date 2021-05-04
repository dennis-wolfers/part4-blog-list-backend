const mongoose = require('mongoose')
const supertest = require('supertest')
// const { request } = require('../app')
const helper = require('./test_helper')
// const logger = require('../utils/logger')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
// const blogsRouter = require('../controllers/blogs')

describe('when initialized with some test blog posts', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ name: 'theName', username: 'root', passwordHash })

    var savedUser = await user.save()
    await api.post('/api/login').send({ username: 'rooot', password: 'sekret' })

    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    blogObject.user = savedUser._id
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    blogObject.user = savedUser._id
    await blogObject.save()
  })

  test('blogs are returned as JSON', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = response.body.token

    await api
      .get('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const loggedIn = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = loggedIn.body.token

    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'bearer ' + token)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id is defined', async () => {
    const loggedIn = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = loggedIn.body.token

    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'bearer ' + token)

    expect(response.body[0].id).toBeDefined()
  })

  describe('post tests', () => {
    test('blog is successfully added', async () => {
      const loggedIn = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
      const token = loggedIn.body.token

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(helper.blogToAdd)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api
        .get('/api/blogs')
        .set('Authorization', 'bearer ' + token)

      expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

      const urls = response.body.map(r => r.url)

      expect(urls).toContain('https://lebowski.com/')
    })

    test('new blog missing a likes entry defaults to zero', async () => {
      const loggedIn = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
      const token = loggedIn.body.token

      const blogSansLikes = {
        title: 'Somebody has to like me best',
        author: 'Dianne Wiest',
        url: 'https://birdcage.com/'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(blogSansLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api
        .get('/api/blogs')
        .set('Authorization', 'bearer ' + token)

      const addedBlog = response.body.filter(r => r.title === 'Somebody has to like me best')

      expect(addedBlog[0].likes).toBe(0)
    })

    test('new blog without Title and URL returns 400', async () => {
      const loggedIn = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
      const token = loggedIn.body.token

      const blogWithoutTitleOrURL = {
        title: null,
        author: 'anon',
        url: null
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(blogWithoutTitleOrURL)
        .expect(400)
    })
  })

  describe('update of a blog', () => {
    test('succeeds with a 200 return code', async () => {
      const loggedIn = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
      const token = loggedIn.body.token

      const blogsAtStart = await helper.blogsInDB()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes = blogToUpdate.likes + 1

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', 'bearer ' + token)
        .send(blogToUpdate)
        .expect(200)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with a 204 return code', async () => {
      const loggedIn = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
      const token = loggedIn.body.token

      const blogsAtStart = await helper.blogsInDB()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'bearer ' + token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDB()

      expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)

      const urls = blogsAtEnd.map(r => r.url)

      expect(urls).not.toContain(blogToDelete.url)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
