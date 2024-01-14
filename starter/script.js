//establish global variables
const searchBtnEl = $("#search-button");

const apiKey = "3b7dc2a8e8d5e5a94b1ce0e837157663";
const savedCities = [];
// const queryURL =
//     "https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API key}";
const searchHistoryEl = function (cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    //identify city name
    const searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    // create container for inputted city
    const searchEntryContainerEl = $("<div>");
    searchEntryContainerEl.addClass("past-search-container");
    searchEntryContainerEl.append(searchHistoryEntry);
    const searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainerEl);

    if (savedSearches.length > 0) {
        // revises array to add previously saved searches
        const previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    // push city name to saved searches
    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    // reset input
    $("#search-input").val("");

    // load saved search history entries into search history container
    var loadSearchHistory = function () {
        // get saved search history
        var savedSearchHistoryEl = localStorage.getItem("savedSearches");

        // return false if there is no previous saved searches
        if (!savedSearchHistoryEl) {
            return false;
        }

        // turn saved search history string into array
        savedSearchHistoryEl = JSON.parse(savedSearchHistoryEl);

        // go through savedSearchHistoryEl array and make entry for each item in the list
        for (var i = 0; i < savedSearchHistoryEl.length; i++) {
            searchHistoryEl(savedSearchHistoryEl[i]);
        }
    };

    var currentWeatherSection = function (cityName) {
        // fetch from API
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
        )
            // convert response into objects
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                // obtain chosen city's longitude and latitude
                var longitude = response.coord.lon;
                var latitude = response.coord.lat;
                //ensure units in URL are metric (as I'm British; you can also do "units=imperial")
                //integrae variables for longitude and latitude in URL
                fetch(
                    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`
                )
                    // get response from API and turn it into objects w/ JSON
                    .then(function (response) {
                        return response.json();
                    })

                    .then(function (response) {
                        searchHistoryList(cityName);

                        // add current weather container
                        var currentWeatherContainerEl = $(
                            "#current-weather-container"
                        );
                        currentWeatherContainerEl.addClass(
                            "current-weather-container"
                        );

                        // add relevant parsed info from API to today's weather card
                        var currentTitle = $("#current-title");
                        var currentDay = moment().format("D/M/YYYY");
                        currentTitle.text(`${cityName} (${currentDay})`);
                        var currentIcon = $("#current-weather-icon");
                        currentIcon.addClass("current-weather-icon");
                        var currentIconCode = response.current.weather[0].icon;
                        currentIcon.attr(
                            "src",
                            `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`
                        );

                        var currentTemperature = $("#current-temperature");
                        currentTemperature.text(
                            "Temperature: " + response.current.temp + " \u00B0C"
                        );

                        var currentWindSpeed = $("#current-wind-speed");
                        currentWindSpeed.text(
                            "Wind Speed: " +
                                response.current.wind_speed +
                                "KM/H"
                        );

                        var currentUltravioletIndex = $(
                            "#current-ultraviolet-index"
                        );
                        currentUltravioletIndex.text("Ultraviolet Index: ");
                        var currentNumber = $("#current-number");
                        currentNumber.text(response.current.uvi);

                        var currentHumidity = $("#current-humidity");
                        currentHumidity.text(
                            "Humidity: " + response.current.humidity + "%"
                        );
                    
                    });
            })
            //catch
            .catch(function (err) {
                // reset search input
                $("#search-input").val("");

                // alert user of error if necessary
                alert(
                    "We could not find the city you searched for. Try searching for a valid city."
                );
            });
    };

    // searchBtnEl.addEventListener("submit", (event) => {
    //     fetch(queryURL)
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (data) {
    //             console.log(data);

    //             const newQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${APIKey}`;

    //             fetch(newQueryUrl)
    //                 .then(function (response) {
    //                     return response.json();
    //                 })
    //                 .then(function (data) {
    //                     console.log(data);
    //                 });

    //             // Hint: Using the 5 Day Weather Forecast API, you'll notice that you will need to pass in coordinates instead of just a city name. Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name?

    //             // You will use localStorage to store any persistent data. For more information on how to work with the OpenWeather API, refer to the Full-Stack Blog on how to use API keys.
    //         });
    // });
};
