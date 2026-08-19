import { useState } from 'react'

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
  const [filteredPersons, setFilteredPersons] = useState(persons);

  const handleChangePersonName = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
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
    event.preventDefault();
    setFilterText(event.target.value);
    // filter the persons array based on the filterText
    const filtered = persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()));
    setFilteredPersons(filtered);
  }

  const handleAddPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newPhoneNo,
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

      <div>
        <span>filter shown with </span>
        <input value={filterText}  onChange={handleFiltering} />
      </div>
      {
        filterText.length > 0 ?
        filteredPersons.length === 0 ? <p>No persons to display</p> :
        filteredPersons.map((person,i) => <p key={person.id}>{person.name} <span>{person.number}</span></p>) :
        null
      }
      <form>
        <div>
          <label>name: </label>
          <input value={newName} onChange={handleChangePersonName} />
        </div>
        <div>
          <label>phone: </label>
          <input value={newPhoneNo} onChange={(event) => setNewPhoneNo(event.target.value)} />
        </div>
        <div>
          <button onClick={handleAddPerson} type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {
        persons.length === 0 ? <p>No persons to display</p> :
        persons.map((person,i) => <p key={person.id}>{person.name} <span>{person.number}</span></p>)
      }
    </div>
  )
}

export default App;