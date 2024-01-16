function startPage() {
    //declare global variables
    const chosenCityEl = document.getElementById("search-city");
    const searchBtnEl = document.getElementById("search-button");
    var fiveDayForeEl = document.getElementById("five-day-header");
    var todayweatherEl = document.getElementById("today-weather");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentEmojiEl = document.getElementById("current-emoji");
    const currentTempEl = document.getElementById("temp");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const historyEl = document.getElementById("search-history");
    //converts retrieved data using JSON into string format so it's usable in this doc
    let searchHistoryEl = JSON.parse(localStorage.getItem("search")) || [];

    // variable w/ my API key (compatible across all of OpenWeatherMapAPI's APIs)
    const APIKey = "3b7dc2a8e8d5e5a94b1ce0e837157663";

    function getWeather(cityName) {
        // Get request from OpenWeatherMapAPI
        let queryURL =
            //uses 'weather' API
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            cityName +
            "&appid=" +
            APIKey;
        axios.get(queryURL).then(function (response) {
            todayweatherEl.classList.remove("d-none");

            // Find current weather
            const currentDate = new Date(response.data.dt * 1000);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            //British date format, you can rearrange the variables for other formats
            nameEl.innerHTML =
                response.data.name +
                " (" +
                day +
                "-" +
                month +
                "-" +
                year +
                ") ";
            //obtain icon from API
            let weatherEmoji = response.data.weather[0].icon;
            currentEmojiEl.setAttribute(
                "src",
                "https://openweathermap.org/img/wn/" + weatherEmoji + "@2x.png"
            );
            currentEmojiEl.setAttribute(
                "alt",
                response.data.weather[0].description
            );
            currentTempEl.innerHTML =
                "Temperature: " + kelv(response.data.main.temp) + " &#176C";
            currentHumidityEl.innerHTML =
                "Humidity: " + response.data.main.humidity + "%";
            //windspeed - notice how 'windspeed' isn't under 'main' in the documentation.
            currentWindEl.innerHTML =
                "Wind Speed: " + response.data.wind.speed + " mph";

            let cityID = response.data.id;
            let forecastQueryURL =
                //uses 'forecast' API
                "https://api.openweathermap.org/data/2.5/forecast?id=" +
                cityID +
                "&appid=" +
                APIKey;
            axios.get(forecastQueryURL).then(function (response) {
                fiveDayForeEl.classList.remove("d-none");

                // Parse info for next 5 days' forecast
                const forecastEls = document.querySelectorAll(".forecast");
                for (i = 0; i < forecastEls.length; i++) {
                    forecastEls[i].innerHTML = "";
                    const forecastIndex = i * 8 + 4;
                    const forecastDate = new Date(
                        response.data.list[forecastIndex].dt * 1000
                    );
                    const forecastDay = forecastDate.getDate();
                    const forecastMonth = forecastDate.getMonth() + 1;
                    const forecastYear = forecastDate.getFullYear();
                    const forecastDateEl = document.createElement("p");
                    forecastDateEl.setAttribute(
                        "class",
                        "mt-3 mb-0 forecast-date"
                    );
                    forecastDateEl.innerHTML =
                        forecastDay + "-" + forecastMonth + "-" + forecastYear;
                    forecastEls[i].append(forecastDateEl);

                    // 5-days weather emoji (from the API)
                    const forecastWeatherEl = document.createElement("img");
                    forecastWeatherEl.setAttribute(
                        "src",
                        "https://openweathermap.org/img/wn/" +
                            response.data.list[forecastIndex].weather[0].icon +
                            "@2x.png"
                    );
                    forecastWeatherEl.setAttribute(
                        "alt",
                        response.data.list[forecastIndex].weather[0].description
                    );
                    forecastEls[i].append(forecastWeatherEl);
                    const forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML =
                        "Temp: " +
                        kelv(response.data.list[forecastIndex].main.temp) +
                        " &#176C";
                    forecastEls[i].append(forecastTempEl);
                    const forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.innerHTML =
                        "Humidity: " +
                        response.data.list[forecastIndex].main.humidity +
                        "%";
                    forecastEls[i].append(forecastHumidityEl);
                }
            });
        });
    }

    // Get history from local storage if any
    searchBtnEl.addEventListener("click", function () {
        const searchTerm = chosenCityEl.value;
        getWeather(searchTerm);
        searchHistoryEl.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistoryEl));
        displaySearchHistoryEl();
    });

    // Clear History button
    clearEl.addEventListener("click", function () {
        //clear local storage (ie. saved valid searches)
        localStorage.clear();
        searchHistoryEl = [];
        displaySearchHistoryEl();
    });
    //convert Kelvin to celsius; -273.15
    function kelv(K) {
        return Math.floor(K - 273.15);
    }

    function displaySearchHistoryEl() {
        historyEl.innerHTML = "";
        //for loop using searchHistoryEl array
        for (let i = 0; i < searchHistoryEl.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistoryEl[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            });
            historyEl.append(historyItem);
        }
    }
    //run the function to display searched cities
    displaySearchHistoryEl();
    if (searchHistoryEl.length > 0) {
        getWeather(searchHistoryEl[searchHistoryEl.length - 1]);
    }
}

startPage();
