import { useState } from 'react'
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';

const App = () => {


   const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

  const [newName, setNewName] = useState('');
  const [newPhoneNo, setNewPhoneNo] = useState('');
  const [filterText, setFilterText] = useState('');

  const handleChangePersonName = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
  }

  const handleChangePhoneNo = (event) => {
    event.preventDefault();
    setNewPhoneNo(event.target.value);
  }

  const checkIfPersonalreadyExists = (personObject) => {
    const personExists = persons.filter(person => person.name === personObject.name);
    if (personExists.length > 0) {
      alert(`${personObject.name} is already added to phonebook`);
      return true;
    }
    return false;
  }

  const handleFiltering = (event) => {
    setFilterText(event.target.value);
  }

  const handleAddPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newPhoneNo,
      id: persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1
    }
    if (!checkIfPersonalreadyExists(personObject)) {
      setPersons([...persons, personObject]);
    }
    setNewName('');
    setNewPhoneNo('');
  }

  return (
     <div>
      <h2>Phonebook</h2>

      <Filter filter={filterText} handleFilterChange={handleFiltering} />
      <PersonForm addPerson={handleAddPerson} newName={newName} handleNameChange={handleChangePersonName} newNumber={newPhoneNo} handleNumberChange={handleChangePhoneNo} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filterText} />
    </div>
  )
}

export default App;