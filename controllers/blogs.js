const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  const user = request.user
  blog.user = user._id

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response
    .status(201)
    .json(savedBlog)
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response
    .status(200)
    .json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  const user = request.user

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'user is not the owner of this blog' })
  }

  await Blog.findByIdAndRemove(blogId)
  response
    .status(204)
    .end()
})

module.exports = blogsRouter