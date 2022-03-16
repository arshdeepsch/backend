const numberRouter = require('express').Router()
const Number = require('../models/number')

numberRouter.get('/', async (req, res) => {
  const notes  = await Number.find({})
  res.json(notes)
})

numberRouter.get('/info', (req, res, next) => {
  Number.find({}).then(
    result => {
      res.send(`<div>Phonebook has info for ${result.length} people</div>
                      <div>${new Date()}</div>`)
    }
  ).catch(error => next(error))
})

numberRouter.get('/:id', (req, res, next) => {
  Number.findById(req.params.id).then(
    number => {
      if (number) {
        res.json(number)
      } else {
        res.status(404).end()
      }
    }
  ).catch(
    error => {
      next(error)
    }
  )
})

numberRouter.delete('/:id', (req, res, next) => {
  Number.findByIdAndRemove(req.params.id).then(
    result => {
      res.status(204).end()
    }
  ).catch(error => next(error))
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

  if ( await Number.findOne({ name: body.name }) ) {
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

numberRouter.put('/:id', (req, res, next) => {
  const id = req.params.id
  const updatedNum = {
    name: req.body.name,
    date: new Date(),
    number: req.body.number
  }

  Number.findByIdAndUpdate(id, updatedNum, {
    runValidators: true,
    new: true,
    context: 'query'
  }).then(
    updated => res.json(updated)
  ).catch(
    error => next(error)
  )
})



























module.exports = numberRouter