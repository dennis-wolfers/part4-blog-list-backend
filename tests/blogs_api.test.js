const mongoose = require('mongoose')
const supertest = require('supertest')
const { request } = require('../app')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  }
]

const blogToAdd = {
  title: 'Added Blog',
  author: 'The Dude',
  url: 'https://lebowski.com/',
  likes: 0
}

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('id is defined', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('blog is successfully added', async () => {
  await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length + 1)

  const urls = response.body.map(r => r.url)

  expect(urls).toContain('https://lebowski.com/')
})

test('new blog missing a likes entry defaults to zero', async () => {
  const blogSansLikes = {
    title: 'Somebody has to like me best',
    author: 'Dianne Wiest',
    url: 'https://birdcage.com/'
  }

  await api
    .post('/api/blogs')
    .send(blogSansLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body.filter(r => r.title === 'Somebody has to like me best')
  expect(addedBlog[0].likes).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})