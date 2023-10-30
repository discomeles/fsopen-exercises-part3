const express = require('express')
const app = express()

let persons = [
  {
    "id": 1,    
    "name": "Arto Hellas",
    "number": "040-123456",
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345",
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  // päiväys
  timestamp = new Date()
  res.send(`Phonebook has info for ${persons.length} people <br/> ${timestamp}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  // jos yhteystieto löytyy, se lähetetään
  if (person) {
    res.json(person)
  // jos ei, vastataan status 404 ilman dataa
  } else {
    res.status(404).end()
  }
  
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)