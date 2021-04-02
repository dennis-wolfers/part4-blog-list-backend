const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1, id: 1 })
    response.json(users)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (!body.password) {
    return response
      .status(400)
      .json({ error: 'Please enter a password.' })
  }

  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ error: 'Please enter a password with more than two characters.' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    response
      .status(201)
      .json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter