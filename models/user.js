const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username.'],
    unique: [true, 'Username must be unique.'],
    minlength: [3, 'Username must have more than three characters.']
  },
  passwordHash: String,
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
    minlength: [3, 'Name must be more than three characters.']
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User