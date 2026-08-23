import { useEffect, useState } from 'react'
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import personsService from './services/persons';

const App = () => {


   const [persons, setPersons] = useState([]);

   useEffect(()=>{
    personsService.getAll().then(setPersons)
   },[])

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

  const handleFiltering = (event) => {
    setFilterText(event.target.value);
  }

  const handleAddPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newPhoneNo,
    }

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService.update(existingPerson.id, personObject).then(updatedPerson => {
          setPersons(persons.map(person => person.id === existingPerson.id ? updatedPerson : person))
        })
      }
    } else {
      personsService.create(personObject).then(createdPerson => {
        setPersons(persons.concat(createdPerson))
      })
    }
    setNewName('');
    setNewPhoneNo('');
  }

  const handleDeletePerson = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.remove(person.id).then(() => {
        setPersons(persons.filter(currentPerson => currentPerson.id !== person.id))
      })
    }
  }

  return (
     <div>
      <h2>Phonebook</h2>

      <Filter filter={filterText} handleFilterChange={handleFiltering} />
      <PersonForm addPerson={handleAddPerson} newName={newName} handleNameChange={handleChangePersonName} newNumber={newPhoneNo} handleNumberChange={handleChangePhoneNo} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filterText} onDelete={handleDeletePerson} />
    </div>
  )
}

export default App;