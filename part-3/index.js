import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Person from './models/person.js';

const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));

morgan.token('body', request => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const getAll = async (request, response) => {
    const people = await Person.find({});
    response.json(people);
}

app.get('/api/persons', getAll);

app.post('/api/persons', async (request, response) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({ error: 'name or number missing' });
    }

    const person = new Person({
        name,
        number
    });

    const savedPerson = await person.save();
    response.status(201).json(savedPerson);
});

app.put('/api/persons/:id', async (request, response) => {
    const updatedPerson = await Person.findByIdAndUpdate(
        request.params.id,
        { name: request.body.name, number: request.body.number },
        { new: true, runValidators: true }
    );

    if (!updatedPerson) {
        return response.status(404).json({ error: 'person not found' });
    }

    response.json(updatedPerson);
});

app.get('/api/persons/:id', async (request, response) => {
    const person = await Person.findById(request.params.id);

    if (!person) {
        return response.status(404).json({ error: 'person not found' });
    }

    response.json(person);
});

app.delete('/api/persons/:id', async (request, response) => {
    const deletedPerson = await Person.findByIdAndDelete(request.params.id);

    if (!deletedPerson) {
        return response.status(404).json({ error: 'person not found' });
    }

    response.status(204).end();
});

app.get('/info', async (request, response) => {
    const personCount = await Person.countDocuments({});

    response.send(`
        <p>Phonebook has info for ${personCount} people</p>
        <p>${new Date()}</p>
    `);
});

app.use((request, response, next) => {
    if (request.method === 'GET' && request.accepts('html')) {
        return response.sendFile(path.join(frontendPath, 'index.html'));
    }

    next();
});

app.use((error, request, response, next) => {
    console.error(error.message);

    if (response.headersSent) {
        return next(error);
    }

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' });
    }

    if (error.name === 'ValidationError' || error.code === 11000) {
        return response.status(400).json({ error: error.message });
    }

    response.status(500).json({ error: 'internal server error' });
});

const port = 3001;
const mongoUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/phonebook';

mongoose.connect(mongoUrl)
    .then(() => {
        app.listen(port, () => {
            console.log('the server is listening on port', port);
        });
    })
    .catch(error => {
        console.error('could not connect to MongoDB:', error.message);
    });