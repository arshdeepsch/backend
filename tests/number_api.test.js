const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Number = require('../models/number')

const initalNumbers = [{
  name: 'arshdeep',
  date: '2022-03-13T23:16:37.295Z',
  number: '000-000-0000'
}, {
  name: 'ronak',
  date: '2022-03-13T23:16:37.295Z',
  number: '200-000-0000'
}]

beforeAll(async () => {
  await Number.deleteMany({})
  let number = new Number(initalNumbers[0])
  await number.save()
  number = new Number(initalNumbers[1])
  await number.save()
})

test('a valid number can be added', async () => {
  const testNumber = {
    name: 'ron',
    date: '2022-03-13T23:16:37.295Z',
    number: '200-000-0000'
  }
  await api
    .post('/api/persons').send(testNumber).expect(201)
  const response = await api.get('/api/persons')
  const names = response.body.map(num => num.name)
  expect(names).toContain('ron')
},1000000)

test('numbers are returned as json', async () => {
  await api
    .get('/api/persons').expect(200).expect('Content-Type', /application\/json/)
})

test('all numbers returned', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(initalNumbers.length)
}, 10000)

test('db contains arshdeep', async () => {
  const response = await api.get('/api/persons')
  const names = response.body.map(num => num.name)
  expect(names).toContain('arshdeep')
}, 10000)

test('number without name is not added', async () => {
  const testNumber = {
    date: '2022-03-13T23:16:37.295Z',
    number: '200-000-0000'
  }
  api.post('/api/persons').send(testNumber).expect(400)
  const resp = await api.get('/api/persons')
  expect(resp.body).toHaveLength(initalNumbers.length)
})

afterAll(() => {
  mongoose.connection.close()
})