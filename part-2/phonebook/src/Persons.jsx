const Persons = ({ persons, filter, onDelete }) => {
  const filteredPersons = persons?.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      {
        filter?.length > 0 
          ? filteredPersons?.map((person) => <p key={person.id}>{person.name} <span>{person.number}</span> <button onClick={() => onDelete(person)}>delete</button></p>)
          : persons?.map((person) => <p key={person.id}>{person.name} <span>{person.number}</span> <button onClick={() => onDelete(person)}>delete</button></p>)
      }
    </div>
  )
}

export default Persons;