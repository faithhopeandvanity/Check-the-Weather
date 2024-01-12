//establish global variables
const searchBtnEl = $("#search-button");
const inputEl = document.querySelector('#search-input');
const citiesEl = document.querySelector('list-group');
const mainCard = document.querySelector('.cityDisplay');
const apiKey = "3b7dc2a8e8d5e5a94b1ce0e837157663"
const queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API key}"
const temp = document.querySelector('#tempDisplay');
const humidity = document.querySelector('#humidityDisplay');
const description = document.querySelector('#descDisplay');
const weatherEmoji = document.querySelector('#weatherEmoji');

searchBtnEl.addEventListener("submit", event => {

fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

    const newQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${APIKey}`

    fetch(newQueryUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)
    })




// Hint: Using the 5 Day Weather Forecast API, you'll notice that you will need to pass in coordinates instead of just a city name. Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name?

// You will use localStorage to store any persistent data. For more information on how to work with the OpenWeather API, refer to the Full-Stack Blog on how to use API keys.

})})





