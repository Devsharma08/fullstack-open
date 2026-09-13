import express from 'express';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));

morgan.token('body', request => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({ error: 'name or number missing' });
    }

    if (persons.some(person => person.name === name)) {
        return response.status(400).json({ error: 'name must be unique' });
    }

    const person = {
        id: Math.floor(Math.random() * 10000000000).toString(),
        name,
        number
    };

    persons.push(person);
    response.status(201).json(person);
});

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

app.use((request, response, next) => {
    if (request.method === 'GET' && request.accepts('html')) {
        return response.sendFile(path.join(frontendPath, 'index.html'));
    }

    next();
});

const port = 3001;
app.listen(port,()=>{
    console.log("the server is listening on port",port);
})