import fetch from 'node-fetch';
import fahrenheitToCelsius from './fahrenheit-to-celsius.js';

const getWeather = async (lat, long, locationName) => {
    console.log('looking up weather...', {lat, long, locationName});
    let weather = {};
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&APPID=${process.env.OWM_APP_ID}`;

    const response = await fetch(apiURL);
    const data = await response.json();

    if (data && data.main && data.main.temp){
        weather.temperature = {
            fahrenheit: Math.round(data.main.temp),
            celsius: fahrenheitToCelsius(data.main.temp)
        };
    }

    if (data && data.weather && data.weather.length){
        switch (data.weather[0].main) {
            case "Clear":
              weather.description = `It's a clear day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Clouds":
              weather.description = `It's a cloudy day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Rain":
              weather.description = `It's a rainy day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Thunderstorm":
              weather.description = `It's a stormy day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Drizzle":
              weather.description = `It's drizzling${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Snow":
              weather.description = `It's a snowy day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Mist":
              weather.description = `It's a misty day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Smoke":
              weather.description = `It's a smoky day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Haze":
              weather.description = `It's a hazey day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Dust":
              weather.description = `It's a dusty day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Fog":
              weather.description = `It's a foggy day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Sand":
              weather.description = `It's a sandy day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Dust":
              weather.description = `It's a dusty day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Ash":
              weather.description = `It's an ashy day${locationName ? ` in ${locationName}` : ''}.`;
              break;
            case "Tornado":
              weather.description = `There's a tornado warning${locationName ? ` in ${locationName}` : ''}.`;
              break;
          }
        
        weather.description_full = `${weather.description} It's ${weather.temperature.fahrenheit}ºF/${weather.temperature.celsius}ºC.`        
    } else {
        console.log('error:getWeather', {apiURL});
        weather.description_full = '';
    }

    return weather;
};

export default getWeather;
