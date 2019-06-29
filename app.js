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
function displayCurrentWeather(location, description, temp, dayDateAndTime) {
    console.log(
        'Current Weather'
        + '\n\nCity: ' + location 
        + '\nForecast: ' + description 
        + '\nCurrent Temp: ' + temp[0] 
        + '\nLow: ' + temp[1] 
        + '\nHigh: ' + temp[2]
        + '\nDay: ' + dayDateAndTime[0]
        + '\nDate: ' + dayDateAndTime[1]
        + '\nTime: ' + dayDateAndTime[2]
    );
    let HTML = '<p id="forecastLocation" class="forecast">' + location + '</p>';
    HTML += '<p id="forecastDescription" class="forecast">' + description + '</p>';
    HTML += '<p id="forecastTemp" class="forecast">' + temp[0] + '&deg</p>';
    HTML += '<p id="lowTemp" class="highLowTemps">' + temp[1] + '</p>';
    HTML += '<p id="highTemp" class="highLowTemps">' + temp[2] + '</p>';
    HTML += '<p id="day" class="dayAndDate">'+ dayDateAndTime[0] + '</p>';
    HTML += '<p id="date" class="dayAndDate">'+ dayDateAndTime[1] + '</p>';
    weatherDisplay.innerHTML = HTML;
}

const fetchCurrentWeatherAPI = function(search) {
    return new Promise(() => {
        let url = 'https://api.openweathermap.org/data/2.5/weather?q=';
        url += search;
        url += id;
        console.log('Current Weather API: ' + url);
        fetch(url).
        then(data => data.json()).
        then((data) => {
            let currentDate = getCurrentWeatherEndPoints(data);
            fetchFiveDayWeatherForecastAPI(search, currentDate[1]);
        });
    });
}

function fetchFiveDayWeatherForecastAPI(search, currentDate) {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=';
    url += search;
    url += id;
    console.log('5 Day API: ' + url);
    fetch(url).
    then(data => data.json()).
    then(data => getFiveDayWeatherForecastEndPoints(data, currentDate));
}

function getCurrentWeatherEndPoints(data) {
    const location = data.name;
    let forecastLocationDateAndTime = locationDateAndTime(data.timezone);
    const decription = data.weather[0].main;
    const kelvinTemps = [data.main.temp, data.main.temp_min, data.main.temp_max];
    const fahrenheitTemps = kelvinToFahrenheitConversion(kelvinTemps);
    displayCurrentWeather(location, decription, fahrenheitTemps, forecastLocationDateAndTime);
    return forecastLocationDateAndTime;
}

function getFiveDayWeatherForecastEndPoints(data, currentDate) {
    const nextFiveDates = getNextFiveDates(data, currentDate);
    console.log(nextFiveDates);
}

function kelvinToFahrenheitConversion(kelvinArray) {
    for(let i = 0; i < kelvinArray.length; i++) {
        kelvinArray[i] = Math.round(kelvinArray[i] * 9/5 - 459.67);
    }
    return kelvinArray;
}

//Get date and time of forecast location
function locationDateAndTime(offset) {
    const offsetInMilliseconds = offset * 1000;
    const usersLocalDate = new Date();
    const utc = usersLocalDate.getTime() + (usersLocalDate.getTimezoneOffset() * 60000);
    const forecastLocationDate = new Date(utc + offsetInMilliseconds);
    switch (forecastLocationDate.getDay()) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
             day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
    };
    const forecastLocationDay = day;
    forecastLocationDateAndTime = [
        forecastLocationDay, 
        forecastLocationDate.toLocaleDateString(), 
        forecastLocationDate.toLocaleTimeString()
    ];
    return forecastLocationDateAndTime;
}

function getNextFiveDates(data, currentDate) {
    //console.log(data.list);
    let currentDateReformat;
    if(currentDate.substring(0, 2) > 9) {
        currentDateReformat = currentDate.substring(6) + '-' + currentDate.substring(0, 2) + '-' + currentDate.substring(3, 5);
    } else {
        currentDateReformat = currentDate.substring(5) + '-0' + currentDate.substring(0, 1) + '-' + currentDate.substring(2, 4);
    }
    const dateSet = [];
    let date;
    for(let i = 0; i < data.list.length; i++) {
        date = data.list[i].dt_txt.substring(0, 10);
        if(!dateSet.includes(date)) {
            dateSet.push(date);
        }
    }
    return dateSet;
}
