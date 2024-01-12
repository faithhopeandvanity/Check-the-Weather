$(".search-button").on("click", function () {

const apiKey = "3b7dc2a8e8d5e5a94b1ce0e837157663"
const queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"

fetch(queryURL).then(function(response){
  return response.json();
})

const inputEl = document.querySelector('.search-input');
const searchBtnEl = document.querySelector('.search-button');
const citiesEl = document.querySelector('list-group');

// Hint: Using the 5 Day Weather Forecast API, you'll notice that you will need to pass in coordinates instead of just a city name. Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name?

// You will use localStorage to store any persistent data. For more information on how to work with the OpenWeather API, refer to the Full-Stack Blog on how to use API keys.

})