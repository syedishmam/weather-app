const id = '&APPID=461cc545cccc3774d751cba7596261d3';

const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");
const searchContainer = document.getElementById("searchContainer");
const weatherDisplay = document.getElementById('weatherDisplay');

//Event Listeners
searchButton.addEventListener('click', () => {
    fetchCurrentWeatherAPI(searchBar.value);
})

searchBar.addEventListener('keypress', (event) => {
    const key = event.which;
    if(key === 13) {
        fetchCurrentWeatherAPI(searchBar.value);
    }
})

//Methods
function displayCurrentWeather(location, description, temp) {
    console.log('City: ' + location 
        + '\nForecast: ' + description 
        + '\nCurrent Temp: ' + temp[0] 
        + '\nLow: ' + temp[1] 
        + '\nHigh: ' + temp[2]);
    let HTML = '<p id="forecastLocation" class="forecast">' + location + '</p>';
    HTML += '<p id="forecastDescription" class="forecast">' + description + '</p>';
    HTML += '<p id="forecastTemp" class="forecast">' + temp[0] + '</p>';
    HTML += '<p id="lowTemp" class="highLowTemps">Low: ' + temp[1] + '</p>';
    HTML += '<p id="highTemp" class="highLowTemps">High: ' + temp[2] + '</p>';
    weatherDisplay.innerHTML = HTML;

}

function fetchCurrentWeatherAPI(search) {
    let city = 'https://api.openweathermap.org/data/2.5/weather?q=';
    city += search;
    city += id;
    console.log(city);
    fetch(city).
    then(data => data.json()).
    then(data => getCurrentWeatherEndPoints(data));
}

function getCurrentWeatherEndPoints(data) {
    const location = data.name;
    const decription = data.weather[0].main;
    //const icon = data.weather[0].icon;
    const kelvinTemps = [data.main.temp, data.main.temp_min, data.main.temp_max];
    const fahrenheitTemps = kelvinToFahrenheit(kelvinTemps);
    displayCurrentWeather(location, decription, fahrenheitTemps);
}

function kelvinToFahrenheit(kelvinArray) {
    for(let i = 0; i < kelvinArray.length; i++) {
        kelvinArray[i] = Math.round(kelvinArray[i] * 9/5 - 459.67);
    }
    return kelvinArray;
}