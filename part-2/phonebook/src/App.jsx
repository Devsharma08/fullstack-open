import { useState } from 'react'

const App = () => {
   const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleChangePersonName = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
  }

  const handleAddPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName
    }
    setPersons(persons.concat(personObject));
    setNewName('');
  }
  return (
     <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleChangePersonName} />
        </div>
        <div>
          <button onClick={handleAddPerson} type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {
        persons.length === 0 ? <p>No persons to display</p> :
        persons.map(person => <p key={person.name}>{person.name}</p>)
      }
    </div>
  )
}

export default App;