import { useEffect, useState } from 'react'
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import personsService from './services/persons';
import Notification from './Notification';

const App = () => {


  const [persons, setPersons] = useState([]);
  const [error,setError] = useState(null);
  const [success,setSuccess] = useState(null);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timeout);
  }, [error]);

  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => setSuccess(null), 5000);
    return () => clearTimeout(timeout);
  }, [success]);

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
          setPersons(persons.map(person => person.id === existingPerson.id ? updatedPerson : person));
          setSuccess(`User ${newName} added successfully`);
        }).catch(error => setError(error.response?.data?.error || error.message));
      }
    } else {
      personsService.create(personObject).then(createdPerson => {
        setPersons(persons.concat(createdPerson));
        setSuccess(`User ${newName} added successfully`);
      }).catch(error => setError(error.response?.data?.error || error.message));
    }
    setNewName('');
    setNewPhoneNo('');
  }

  const handleDeletePerson = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.remove(person.id).then(() => {
        setPersons(persons.filter(currentPerson => currentPerson.id !== person.id));
        setSuccess(`User ${person.name} deleted successfully`);
      }).catch((error)=>{
        setError(error.response?.data?.error || error.message);
      })
    }
  }

  return (
     <div>
      <h2>Phonebook</h2>
      {error && <Notification message={error} styles={{
          border: "2px solid black",
          backgroundColor:"gray",
          color:"red",
          padding:"2px 5px",
          margin:"10px auto"
      }} />}
      {success && <Notification message={success} styles={{
          border: "2px solid black",
          backgroundColor:"gray",
          color:"green",
          padding:"2px 5px",
          margin:"10px auto"
      }}/>}
      <Filter filter={filterText} handleFilterChange={handleFiltering} />
      <PersonForm addPerson={handleAddPerson} newName={newName} handleNameChange={handleChangePersonName} newNumber={newPhoneNo} handleNumberChange={handleChangePhoneNo} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filterText} onDelete={handleDeletePerson} />
    </div>
  )
}

export default App;