const numberRouter = require('express').Router()
const { response } = require('../app')
const Number = require('../models/number')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}

numberRouter.get('/', async (req, res) => {
  const notes = await Number.find({}).populate('user',{ username: 1, id: 1 })
  res.json(notes)
})

numberRouter.get('/info', async (req, res, next) => {
  const result = await Number.find({})
  res.send(`<div>Phonebook has info for ${result.length} people</div>
  <div>${new Date()}</div>`)
})

numberRouter.get('/:id', async (req, res, next) => {
  const result = await Number.findById(req.params.id)
  if (result) {
    res.json(result)
  } else {
    res.status(404).end()
  }
})

numberRouter.delete('/:id', async (req, res, next) => {
  await Number.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

numberRouter.post('/', async (req, res, next) => {
  const body = req.body3
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token,process.env.SECRET)
  if(!decodedToken.id){
    return res.status(401).json({ error: 'missing token or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!body.name) {
    return res.status(400).json({
      error: 'missing name'
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'missing number'
    })
  }

  const number = new Number({
    name: body.name,
    date: new Date(),
    number: body.number,
    user: user._id
  })
  if (await Number.findOne({
    name: body.name
  })) {
    res.status(500).send({
      error: `${body.name} is already in the phone book`
    })
  } else {
    const savedNumber = await number.save()
    user.numbers = user.numbers.concat(savedNumber._id)
    await user.save()
    res.json(savedNumber)
  }
})

numberRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const updatedNum = {
    name: req.body.name,
    date: new Date(),
    number: req.body.number
  }
  const updated = await Number.findByIdAndUpdate(id, updatedNum, {
    runValidators: true,
    new: true,
    context: 'query'
  })
  res.json(updated)
})


module.exports = numberRouter