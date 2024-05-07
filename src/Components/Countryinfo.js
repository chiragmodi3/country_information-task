import React, { useState } from 'react';
import '../CSS/Countryinfo.css';

const Countryinfo = () => {
  const [countryName, setCountryName] = useState('');
  const [countryInfo, setCountryInfo] = useState(null);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setCountryName(event.target.value);
    setCountryInfo(null);
    setError('');
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://restcountries.com/v3/name/${countryName}`);
      const data = await response.json();

      if (response.ok && data.length > 0) {
        setCountryInfo(data[0]);
        setError('');
      } else {
        setCountryInfo(null);
        setError('Country data not found');
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
      setError('Error fetching country data');
    }

    setLoading(false);
  };

  const fetchWeatherData = async () => {
    if (countryInfo && countryInfo.capital) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${countryInfo.capital}&appid=eab070d611436086db6b740a6d556f2a&units=metric`
        );

        if (response.ok) {
          const weatherInfo = await response.json();
          setWeatherData(weatherInfo);
          setError('');
        } else {
          const errorText = await response.text();
          setError('Weather data not available');
          setWeatherData(null);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data');
        setWeatherData(null);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="input-container">
          <label htmlFor="countryName">Country Name:</label>
          <input
            id="countryName"
            type="text"
            placeholder='Enter Country Name'
            value={countryName}
            onChange={handleInputChange}
          />
        </div>
        <br />
        <button className="button" type="submit" disabled={!countryName || loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {countryInfo && (
        <div className="country-info">
          <h2>{countryInfo.name.common}</h2>
          <p>Capital: {countryInfo.capital}</p>
          <p>Population: {countryInfo.population}</p>
          <p>Latitude: {countryInfo.latlng[0]}</p>
          <button className="button" onClick={fetchWeatherData} disabled={loading}>
            {loading ? 'Loading Weather...' : 'Capital Weather'}
          </button>
        </div>
      )}
      {weatherData && (
        <div className="weather-info">
          <h3>Current Weather in {countryInfo.capital}</h3>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt="Weather Icon" />
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Countryinfo;
