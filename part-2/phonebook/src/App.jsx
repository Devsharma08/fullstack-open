import { useState } from 'react'

const App = () => {
   const [persons, setPersons] = useState([{name: 'Arto Hellas', phoneno: '040-123456'}]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNo, setNewPhoneNo] = useState('')

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

  const handleAddPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      phoneno: newPhoneNo
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
        persons.map(person => <p key={person.name}>{person.name} <span>{person.phoneno}</span></p>)
      }
    </div>
  )
}

export default App;