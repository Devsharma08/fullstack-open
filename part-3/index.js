import express from 'express';

const app = express();
app.use(express.json());

const persons = [
    {
        id: '1',
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: '2',
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: '3',
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: '4',
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }
];

const getAll = (request, response) => {
    response.json(persons);
}

app.get('/api/persons', getAll);

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(entry => entry.id === request.params.id);

    if (!person) {
        return response.status(404).json({ error: 'person not found' });
    }

    response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const personIndex = persons.findIndex(entry => entry.id === request.params.id);

    if (personIndex === -1) {
        return response.status(404).json({ error: 'person not found' });
    }

    persons.splice(personIndex, 1);
    response.status(204).end();
});

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
});

const port = 3001;
app.listen(port,()=>{
    console.log("the server is listening on port",port);
})