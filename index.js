const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// lisätään morganin logattavaksi
morgan.token('body', (req) => {
  return JSON.stringify(req.body, ["name","number"])
  })

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

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  console.log(id)
  persons = persons.filter(person => person.id === id)
  res.status(204).end()
})

app.post('/api/persons', (req,res) => {
  const person = req.body

  if (!person.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!person.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.findIndex((element) => element.name === person.name) != -1) {
    return res.status(400).json({
      error: 'name is already in the phonebook'
    })
  }

  const newID = Math.floor(Math.random() * 100000)
  person.id = newID
  persons = persons.concat(person)
  res.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)