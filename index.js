const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return null
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const dateObj = new Date()
    res.send(`<div>Phonebook has info for ${persons.length} people</div> 
        <div>${dateObj}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.filter(person => person.id === Number(req.params.id))
    if (person.length > 0) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id))
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name) {
        return res.status(400).json({ error: 'missing name' })
    } else if (!body.number) {
        return res.status(400).json({ error: 'missing number' })
    } else if (persons.filter((person) => person.name === body.name).length > 0) {
        return res.status(400).json({ error: 'name must be unique' })
    }
    const obj = {
        "id": Math.floor(Math.random() * 100000),
        "name": body.name,
        "number": body.number
    }
    persons = persons.concat(obj)
    res.json(obj)
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
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
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})