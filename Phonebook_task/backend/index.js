const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

//middleware

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

//get request
app.get("/", (request, response) => {
  response.send("Phonebook");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const currentDataTime = new Date().toString();
  response.send(`<p> phonebook has info for ${persons.length} people</p><br/>
    <p>${currentDataTime}</p>`);
});

app.get("/api/persons/:person", (request, response) => {
  const personId = request.params.person;
  const person = persons.find((person) => person.id === personId);
  person ? response.json(person) : response.status(404).end();
});

//post request
app.post("/api/persons", (request, response) => {
  const personId =
    persons.length > 0 ? Math.ceil(Math.random()) * persons.length : 0;

  const body = request.body;
  body.id = Number(personId + 1);

  if (!body.name) {
    response.status(400).json({
      error: "name required",
    });
  } else if (persons.find((i) => i.name === body.name)) {
    response.status(206).json({
      error: "name should be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: body.id,
  };

  response.json(person);
});

//delete request
app.delete("/api/persons/:person", (request, response) => {
  const personId = request.params.person;
  persons.filter((person) => person.id !== personId);
  response.statusMessage = "Person deleted";
  response.status(204).end();
});

//put request
app.put("/api/persons/:person", (request, response) => {
  const personId = request.params.person;
  const person = persons.find((person) => person.id === personId);
  const updatePerson = {
    ...person,
    name: request.body.name,
    number: request.body.number,
  };
  persons.map((p) => (p.id === personId ? updatePerson : p));

  response.json();
});

//patch request

app.use(unknownEndpoint);

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
