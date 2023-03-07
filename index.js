const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")

//This is middleware, it adds the property body to the request with js object
app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())

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


app.get("/info", (request, response) => {
    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toISOString()}</p>
    `
    response.send(info)
})

app.get("/api/persons", (request, response) => {
    getMaxId()
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const requestId = Number(request.params.id)

    const person = persons.find(n => n.id === requestId)

    if (!person) {
        return response.status(404).end()
    }
    response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
    const requestId = Number(request.params.id)

    persons = persons.filter(p => p.id !== requestId)

    response.status(204).end()
})

const getMaxId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

const getRandomId = () => {
    let tempId = 0
    do{
        tempId = Math.floor(Math.random() * 999999)
    } while (persons.find(n => n.id === tempId))

    return tempId
}

app.post("/api/persons", (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "Name or number missing from request"
        })
    } else if(persons.find(n => n.name === body.name)){
        return response.status(400).json({
            error: "Name must be unique"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getRandomId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})