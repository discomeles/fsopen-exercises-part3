const mongoose = require('mongoose')

// kirjautumistiedot ovat ympäristömuuttujissa
const mongo_url = process.env.MONGODB_URL
const mongo_user = process.env.MONGODB_USER
const mongo_password = process.env.MONGODB_PASSWORD

const url = `mongodb+srv://${mongo_user}:${mongo_password}@${mongo_url}/shoppingdatabase?retryWrites=true&w=majority`

console.log('connecting to', mongo_url)

// yhdistetään Mongo Atlakseen
mongoose.connect(url)
  .then(result => {
    console.log('Connected to Mongo Atlas')
  })
  .catch((error) => {
    console.log('Failed to connect to Mongo Atlas. Reason:',error.message)
  })

// määritellään yhteystieto-olion skeema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /^(\d{2,3})-(\d{6,8})$/.test(v)
      },
      message: 'Wrong number format. Please format number as 09-1234567 or 040-12345678'
    }
  },
},
// pakotetaan kokoelman nimi
{ collection: 'persons' })

// muotoillaan mongoosen palauttaman olion id
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)