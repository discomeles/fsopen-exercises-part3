const mongoose = require('mongoose')

// haetaan url ja käyttäjä ympäristömuuttujista
const mongo_url = process.env.MONGODB_URL
const mongo_user = process.env.MONGODB_USER

// määritellään yhteystieto-olion skeema
const personSchema = new mongoose.Schema({
  name:String,
  number:String
},
// pakotetaan kokoelman nimi
{ collection: 'persons' })

const Person = mongoose.model('Person', personSchema)

// virhe, jos annetaan liian vähän parametreja
if (process.argv.length<3) {
  console.log('Not enough paramaters. Did you forget to give a password as an argument?')
  process.exit(1)
}

// virhe, jos annetaan ylimääräisiä parametreja
if (process.argv.length>5) {
  console.log('Too many parameters. Did you forget to enclose "Firstname Surname" with quotation marks?')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://${mongo_user}:${password}@${mongo_url}/mongotest?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// jos parametriksi annetaan vain salasana
// haetaan tiedot
if (process.argv.length===3) {
  Person.find({}).then(data => {
    console.log('phonebook:')
    data.forEach(person => {
      console.log(person.name +' '+ person.number)
    })
    mongoose.connection.close()
  })


// jos annetaan muut parametrit
} else if (process.argv.length===5) {

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

}


