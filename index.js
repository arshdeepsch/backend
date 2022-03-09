require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
const person = require('./models/person')
const {
    response
} = require('express')
const password = process.argv[2];

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return null
})

app.get('/api/persons', (req, res) => {
    person.find({}).then(result => {
        res.json(result);
    })
})

app.get('/info', (req, res) => {
    const dateObj = new Date()
    res.send(`<div>Phonebook has info for ${persons.length} people</div> 
        <div>${dateObj}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
    person.find({
        id: Number(req.params.id)
    }).then(number => {
        res.json(number)
    })
    // const person = persons.filter(person => person.id === Number(req.params.id))
    // if (person.length > 0) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id))
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const person = new personModel({
        name: body.name,
        date: new Date(),
        number: body.number,
    });
    person.save().then(
        result => {
            response.json(result);
        }
    )
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    person.updateOne({
        id: id
    },
    {
        
    })
    person.find({}).then(number => number.name);
    persons = persons.map((person) => {
        if (person.id === id) {
            person.number = body.number;
        }
        return person;
    })
    res.json(persons.find(
        (person) => person.id === id
    ))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})