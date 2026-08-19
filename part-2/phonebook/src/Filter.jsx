const Filter = ({ filter, handleFilterChange }) => {  return (
    <div>
      <span>filter shown with </span>
      <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

export default Filter;