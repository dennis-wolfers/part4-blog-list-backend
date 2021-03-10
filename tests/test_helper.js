const usersRouter = require('../controllers/users')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

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

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  const processedBlogs = blogs.map(blog => blog.toJSON())
  return processedBlogs
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDB,
  usersInDB
}