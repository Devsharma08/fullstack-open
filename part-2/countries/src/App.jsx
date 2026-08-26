import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState('');

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setAllCountries(response.data))
      .catch(() => setWeatherError('Could not load country data.'));
  }, []);

  const matches = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(query.toLowerCase()),
  );

  const countryView = selectedCountry || (matches.length === 1 ? matches[0] : null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!countryView || !apiKey || !countryView.capital?.[0]) {
      return;
    }

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: { q: countryView.capital[0], units: 'metric', appid: apiKey },
      })
      .then((response) => setWeather(response.data))
      .catch(() => setWeatherError('Could not load the weather report.'));
  }, [countryView]);

  const onChange = (event) => {
    setQuery(event.target.value);
    setSelectedCountry(null);
    setWeather(null);
    setWeatherError('');
  };

  const showCountry = (country) => {
    setSelectedCountry(country);
    setQuery(country.name.common);
    setWeather(null);
    setWeatherError('');
  };

  return(
    <main>
      <header>
        <h2>Countries</h2>
        <label htmlFor="country-search">Find countries: </label>
        <input
          id="country-search"
          type="text"
          value={query}
          onChange={onChange}
        />
      </header>

      <section aria-live="polite">
        {query && matches.length > 10 && <p>Too many matches, specify another filter.</p>}
        {query && matches.length === 0 && <p>No countries match your search.</p>}
        {query && matches.length > 1 && matches.length <= 10 && (
          <ul>
            {matches.map((country) => (
              <li key={country.cca3}>
                <span>{country.name.common}</span>
                <button type="button" onClick={() => showCountry(country)}>Show</button>
              </li>
            ))}
          </ul>
        )}

        {countryView && (
          <article>
            <div>
              <h2>{countryView.name.common}</h2>
              <dl>
                <dt>Capital</dt><dd>{countryView.capital?.join(', ') || 'Unknown'}</dd>
                <dt>Area</dt><dd>{countryView.area.toLocaleString()} km²</dd>
                <dt>Languages</dt><dd>{Object.values(countryView.languages || {}).join(', ') || 'Unknown'}</dd>
              </dl>
            </div>
            <img width="300" src={countryView.flags.svg || countryView.flags.png} alt={`Flag of ${countryView.name.common}`} />

            <div>
              <h3>Weather in {countryView.capital?.[0] || 'the capital'}</h3>
              {weather && <p className="temperature">{Math.round(weather.main.temp)}°C <span>{weather.weather[0].description}</span></p>}
              {weather && <p>Wind: {weather.wind.speed} m/s</p>}
              {weatherError && <p>{weatherError}</p>}
              {!weather && !weatherError && !import.meta.env.VITE_WEATHER_API_KEY && <p>Weather is unavailable without an API key.</p>}
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export default App;