import {useState} from 'react';
const App = () => {
  const [good,setGood] = useState(0);
  const [neutral,setNeutral] = useState(0);
  const [bad,setBad] = useState(0); 

  return (
    <div>
      <div>
        <h2>Give feedback</h2>
        <div >
              <button onClick={() => setGood(good + 1)}>
                good
              </button>
              <button onClick={() => setNeutral(neutral + 1)}>
                neutral
              </button>
              <button onClick={() => setBad(bad + 1)}>
                bad
              </button>
        </div>
      </div>
      <div>
        <h2>Statistics</h2>
        <div>
          <p>good {good}</p>
          <p>neutral {neutral}</p>
          <p>bad {bad}</p>
        </div>
      </div>
    </div>
  )
 }


export default App;