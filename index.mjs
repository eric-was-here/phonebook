import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv/config'
import Person from './models/person.js'

const app = express()

app.use(express.static('dist'))

app.use(express.json())

app.use(morgan('combined'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
  console.log('finding persons')
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
    // .catch(err => {
    //   console.error(err)
    //   response.status(400).send({ error: 'malformed id'})
  // })
  // let person = persons.find(p => p.id === request.params.id)
  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
})
//
// const generateId = () => {
//   const max = persons.length > 0
//     ? Math.max(...persons.map((p) => Number(p.id)))
//     : 0
//   return String(max + 1)
// }
//
app.post('/api/persons', (request, response) => {
  // The name or number is missing
  // The name already exists in the phonebook
  //
  // make a new Person using request body
  // save Person
  //
  let body = request.body

  // if (body.name === '' || body.number === '') {
  //   console.error("Missing name or number")
  //   response.json('{ error: missing }').status(422).end()
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(err => next(err))

//
//
//   if (persons.find((p) => p.name === body.name)) {
//     console.error('Person already exists')
//     response.send({ error: 'person already exists' }).status(422).end()
//   }
//
//   const person = {
//     id: generateId(),
//     name: body.name,
//     number: body.number,
//   }
//
//   persons = persons.concat(person)
//   response.status(201).end()
})
//
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(person => {
    response.status(204).end()
  })
    .catch(err => next(err))
  // persons = persons.filter(p => p.id !== request.params.id)
})
//
// app.get('/info', (request, response) => {
//   const date = new Date()
//   response.send(`<p>Phonebook has info for ${persons.length}</p><p>${date}</p>`)
// })


// Middleware after routes

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
