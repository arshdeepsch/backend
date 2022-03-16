const numberRouter = require('express').Router()
const Number = require('../models/number')

numberRouter.get('/', async (req, res) => {
  const notes = await Number.find({})
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
  const body = req.body
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
    number: body.number
  })
  if (await Number.findOne({
    name: body.name
  })) {
    res.status(500).send({
      error: `${body.name} is already in the phone book`
    })
  } else {
    number.save().then(
      result => {
        res.status(201).json(result)
      }
    ).catch(error => next(error))
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