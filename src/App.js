import axios from "axios"
import { useState, useEffect } from "react"

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [weatherData, setWeatherData] = useState(null)

  const result = countries.map((country) => (
    <div key={country.name.common}>
      {country.name.common}{" "}
      <button
        onClick={() => {
          setFilter(country.name.common)
        }}
      >
        show
      </button>
    </div>
  ))

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      if (filter !== "") {
        const filtered = response.data.filter((country) =>
          country.name.common.toLowerCase().includes(filter.toLowerCase())
        )
        setCountries(filtered)
      }
    })
  }, [filter])

  useEffect(() => {
    if (countries.length === 1) {
      const lat = countries[0].latlng[0]
      const lng = countries[0].latlng[1]
      const api_key = process.env.REACT_APP_API_KEY
      console.log("key", api_key)
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}&units=metric`
        )
        .then((response) => {
          console.log("response", response)
          setWeatherData(response.data)
        })
    }
  }, [filter])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  if (countries.length > 10)
    return (
      <div>
        <div>
          Find countries: <input value={filter} onChange={handleFilterChange} />
        </div>
        <div>Too many matches, specify another filter</div>
      </div>
    )
  else if (countries.length === 1 && weatherData) {
    const img = weatherData.weather[0].icon
    return (
      <div>
        <div>
          Find countries: <input value={filter} onChange={handleFilterChange} />
        </div>
        <h2>{countries[0].name.common}</h2>
        <div>Capital: {countries[0].capital}</div>
        <div>Area: {countries[0].area} km²</div>
        <div>Population: {countries[0].population}</div>
        <div>
          <h3>Languages:</h3>
          <ul>
            {Object.values(countries[0].languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </div>
        <div>
          <img src={countries[0].flags.png} alt={countries[0].name.common} />
        </div>
        <div>
          <h3>weather in {countries[0].capital}:</h3>
          <p>temperature: {weatherData.main.temp} Celcius</p>
          <img
            src={`http://openweathermap.org/img/wn/${img}@2x.png`}
            alt={countries[0].name.common}
          />
          <p>wind {weatherData.wind.speed} m/s</p>
        </div>
      </div>
    )
  } else if (countries.length > 1) {
    return (
      <div>
        <div>
          Find countries: <input value={filter} onChange={handleFilterChange} />
        </div>
        <div>
          <div>{result}</div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div>
          Find countries: <input value={filter} onChange={handleFilterChange} />
        </div>
        <div>No results</div>
      </div>
    )
  }
}

export default App
