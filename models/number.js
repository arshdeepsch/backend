const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI

console.log('connecting to ', uri)

mongoose.connect(uri).then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const numberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    number: {
        type: String,
        required: true
    }
})

numberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Number', numberSchema)