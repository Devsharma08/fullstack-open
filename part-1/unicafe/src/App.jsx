import {useState} from 'react';

const StatisticLine = (props) => {
  const {text, value} = props;
  return (
    <p>{text} {value}</p>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const Statistics = (props) => {
  const {good, neutral, bad} = props;
  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = (good / all) * 100;

  return (
    <div>
    {
      (all === 0) ? <p>No feedback given</p> : (
      <div>
        <table>
          <tbody>
            <tr>
              <td>good</td>
              <td>{good}</td>
            </tr>
            <tr>
              <td>neutral</td>
              <td>{neutral}</td>
            </tr>
            <tr>
              <td>bad</td>
              <td>{bad}</td>
            </tr>
            <tr>
              <td>all</td>
              <td>{all}</td>
            </tr>
            <tr>
              <td>average</td>
              <td>{average}</td>
            </tr>
            <tr>
              <td>positive</td>
              <td>{positive.toFixed(1)} %</td>
            </tr>
          </tbody>
        </table>
      </div>
     )
  } 
  </div>
)
}

const App = () => {
  const [good,setGood] = useState(0);
  const [neutral,setNeutral] = useState(0);
  const [bad,setBad] = useState(0); 

  return (
    <div>
      <div>
        <h2>Give feedback</h2>
        <div>
          <Button onClick={() => setGood(good + 1)} text="good" />
          <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
          <Button onClick={() => setBad(bad + 1)} text="bad" />
        </div>
      </div>
      <div>
        <h2>Statistics</h2>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </div>
  )
 }


export default App;