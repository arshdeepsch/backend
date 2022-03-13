const mongoose = require('mongoose')

if (process.argv.length != 5 && process.argv.length != 3) {
  console.log('proper form: node mongo.js <passwod> <name> <number>')
} else if (process.argv.length == 5) {
  const pass = process.argv[2]
  const uri = `mongodb://fullstack:${pass}@phonebook-shard-00-00.sympi.mongodb.net:27017,phonebook-shard-00-01.sympi.mongodb.net:27017,phonebook-shard-00-02.sympi.mongodb.net:27017/Phonebook?ssl=true&replicaSet=atlas-5i41jf-shard-0&authSource=admin&retryWrites=true&w=majority`

  mongoose.connect(uri)

  const numberSchema = new mongoose.Schema({
    name: String,
    date: Date,
    number: String,
  })

  const Number = mongoose.model('Number', numberSchema)

  const number = new Number({
    name: process.argv[3],
    date: new Date(),
    number: process.argv[4]
  })

  number.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length == 3) {
  const pass = process.argv[2]
  const uri = `mongodb://fullstack:${pass}@phonebook-shard-00-00.sympi.mongodb.net:27017,phonebook-shard-00-01.sympi.mongodb.net:27017,phonebook-shard-00-02.sympi.mongodb.net:27017/Phonebook?ssl=true&replicaSet=atlas-5i41jf-shard-0&authSource=admin&retryWrites=true&w=majority`

  mongoose.connect(uri)

  const numberSchema = new mongoose.Schema({
    name: String,
    date: Date,
    number: String,
  })

  const Number = mongoose.model('Number', numberSchema)

  const number = new Number({
    name: process.argv[3],
    date: new Date(),
    number: process.argv[4]
  })

  Number.find({}).then(result => {
    result.forEach(number => {
      console.log(`${number.name} ${number.number}`)
    });
    mongoose.connection.close()
  })
}