const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  passHash: String,
  numbers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Number'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passHash
  }
})

const User = mongoose.model('User',userSchema)
module.exports = User