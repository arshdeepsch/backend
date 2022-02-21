const mongoose = require('mongoose');

if (process.argv.length == 5) {


  const password = process.argv[2];

  const url = `mongodb+srv://fullstack:${password}@phonebook-1.sympi.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url);
  const phonebookSchema = new mongoose.Schema({
    name: String,
    date: Date,
    number: String,
  })

  const phoneModel = mongoose.model('Number', phonebookSchema);

  const number = new phoneModel({
    name: process.argv[3],
    date: new Date(),
    number: process.argv[4],
  })

  number.save().then(
    result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })

} else if (process.argv.length == 3) {

  const password = process.argv[2];

  const url = `mongodb+srv://fullstack:${password}@phonebook-1.sympi.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url);
  const phonebookSchema = new mongoose.Schema({
    name: String,
    date: Date,
    number: String,
  })

  const phoneModel = mongoose.model('Number', phonebookSchema);
  phoneModel.find({}).then(
    result => {
      result.forEach(number => {
        console.log(`${number.name} ${number.number}`);
      })
      mongoose.connection.close()
    }
  )

} else {
  console.log('format the command as  node mongo.js <password> <name> <number>');
}
