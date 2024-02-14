import React from 'react';
import './card.css';
import { useEffect, useState } from 'react';
import capitalizeWords from '../../helpers/Capitalize';

const Card = () => {
  const APIKEY = '3bfc0cd44f04d4756d9cc22c38f5e938';
  const [isloading, setIsloading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [geoLocationData, setGeoLocationData] = useState(null);
  let date = new Date().toJSON();

  // conseguimos el valor ingresado en el input (La ciudad)

  const handleInputChange = (event) => {
    const inputvalue = event.target.value;
    setCity(capitalizeWords(inputvalue));
  };

  // conseguimos nuestra ubicación personal (latitud y longitud)
  useEffect(() => {
    setIsloading(true);
    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude);
          console.log(longitude);

          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error obteniendo ubicación actual:', error);
          setIsloading(false);
        }
      );
    };
    getCurrentLocation();
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    setIsloading(true);
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`
    );
    const data = await resp.json();
    setWeatherData(data);
    console.log(weatherData);

    setIsloading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (city.trim() != '' && city.length > 2) {
      setIsloading(true);

      const geoLocationResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},PE,&limit=5&appid=${APIKEY}`
      );
      const geoLocationData = await geoLocationResponse.json();

      if (geoLocationData.length > 0) {
        setGeoLocationData(geoLocationData);
        const { lat, lon } = geoLocationData[0];
        fetchWeatherData(lat, lon);
        const updatedLocations = [...locations, city];
        setLocations(updatedLocations);
        setIsloading(false);
      } else {
        return;
      }
    }
    setCity('');
  };
  if (isloading) {
    return <p>...CARGANDO</p>;
  }
  return (
    <div className='weathercard'>
      <div className='weathercard__image'>
        {weatherData && (
          <>
            <h1>{parseInt(weatherData.main.temp)}°</h1>
            <div className=''>
              <article className='flex'>
                {geoLocationData && <h2>{geoLocationData[0].name}</h2>}

                <h5>{weatherData.sys.country}</h5>
              </article>
              <p>{date}</p>
            </div>
            <article>
              <img src='' alt='' />
              <h4>weather</h4>
            </article>
          </>
        )}
      </div>
      <div className='weathercard__info'>
        <form
          onSubmit={handleSubmit}
          className='weathercard__info-searchsection'>
          <input
            id='search'
            list='cities'
            placeholder='location'
            onChange={handleInputChange}
          />
          <button type='submit'>search</button>
          <datalist id='cities'>
            <option value='Ica'></option>
            <option value='Lima'></option>
            <option value='Nazca'></option>
            <option value='Arequipa'></option>
            <option value='Abancay'></option>
            <option value='San Juan'></option>
          </datalist>
        </form>
        <div className='weathercard__info-recent'>
          <ul className='weathercard__info-recent_locations'>
            {locations.map((location) => (
              <li key={location}>{location}</li>
            ))}
          </ul>
        </div>
        <hr />
        {weatherData && (
          <div className='weathercard__info-details'>
            <article className='details'>
              <h4>Wind Speed</h4>
              <p>{weatherData.wind.speed} m/s</p>
            </article>
            <article className='details'>
              <h4>Humidity</h4>
              <p>{weatherData.main.humidity}%</p>
            </article>
            <article className='details'>
              <h4>Pressure</h4>
              <p>{weatherData.main.pressure} hPa</p>
            </article>
            <article className='details'>
              <h4>temperature sensation</h4>
              <p>{parseInt(weatherData.main.feels_like)}°</p>
            </article>
          </div>
        )}

        <hr />
      </div>
    </div>
  );
};

export default Card;
