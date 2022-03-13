require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

const Number = require('./models/number')
const {
    response
} = require('express')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return null
})

app.get('/api/persons', (req, res) => {
    Number.find({}).then(
        result => {
            res.json(result)
        }
    )
})

app.get('/info', (req, res, next) => {
    Number.find({}).then(
        result => {
            res.send(`<div>Phonebook has info for ${result.length} people</div> 
                    <div>${new Date()}</div>`)
        }
    ).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
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

app.delete('/api/persons/:id', (req, res, next) => {
    Number.findByIdAndRemove(req.params.id).then(
        result => {
            res.status(204).end()
        }
    ).catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body;
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
        "name": body.name,
        "date": new Date(),
        "number": body.number
    })
    number.save().then(
        result => {
            res.json(result)
        }
    )
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const updatedNum = {
        name: req.body.name,
        number: req.body.number
    }

    Number.findByIdAndUpdate(id, updatedNum, {
        new: true
    }).then(
        updated => res.json(updated)
    ).catch(
        error => next(error)
    )
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    }
    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})