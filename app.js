const express = require('express')
const app = express()
const numberRouter = require('./controllers/number')
// const morgan = require('morgan')
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')
const mongoose = require('mongoose')
require('express-async-errors')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(
  () => {
    logger.info('connected to MONOGDB')
  }
).catch(
  (error) => {
    logger.error('error connecting to MONGODB', error.message)
  }
)

// morgan.token('body', (req, res) => {
//   if (req.method === 'POST') {
//     return JSON.stringify(req.body)
//   }
//   return null
// })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/persons', numberRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

module.exports = app