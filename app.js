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
        //console.log('Current Weather API: ' + url);
        fetch(url).
        then(data => data.json()).
        then((data) => {
            let currentDayDateAndTime = getCurrentWeatherEndPoints(data);
            fetchFiveDayWeatherForecastAPI(search, currentDayDateAndTime);
        });
    });
}

function fetchFiveDayWeatherForecastAPI(search, currentDayDateAndTime) {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=';
    url += search;
    url += id;
    //console.log('5 Day API: ' + url);
    fetch(url).
    then(data => data.json()).
    then(data => getFiveDayWeatherForecastEndPoints(data, currentDayDateAndTime));
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

function getFiveDayWeatherForecastEndPoints(data, currentDayDateAndTime) {
    const nextFiveDates = getNextFiveDates(data, currentDayDateAndTime[1]);
    const nextFiveDays = getNextFiveDays(currentDayDateAndTime[0]);
    for(let i = 0; i < nextFiveDates.length; i++) {
        console.log(nextFiveDates[i] + ': ' + nextFiveDays[i]);
    }
}

function getNextFiveDates(data, currentDate) {
    //Reformats date from 7/1/2019 to 2019-07-01
    //console.log(data.list);
    let currentDateReformat = reformatCurrentDate(currentDate)
    const dateSet = [];
    let date;
    for(let i = 0; data.list.length > i; i++) {
        date = data.list[i].dt_txt.substring(5, 10);
        //If dateSet does not include an instance of date and date is not the same as current date add to dateSet
        if(!dateSet.includes(date) && date !== currentDateReformat.substring(5, 10)) {
            dateSet.push(date);
        }
    }
    //console.log(currentDateReformat.substring(5, 10));
    //console.log(date);
    //Replace - with / and if date starts with 0, remove it
    for(let j = 0; dateSet.length > j; j++) {
        dateSet[j] = dateSet[j].substring(0, 2) + '/' + dateSet[j].substring(3, 5);
        if(parseInt(dateSet[j].substring(0, 1)) === 0) {
            dateSet[j] = dateSet[j].substring(1);
        }
    }
    return dateSet;
}

function getNextFiveDays(currentDay) {
    let daysArray = [];
    switch(currentDay) {
        case 'Sunday':
            daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            break;
        case 'Monday': {
            daysArray = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            break;
        }
        case 'Tuesday': {
            daysArray = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            break;
        }
        case 'Wednesday': {
            daysArray = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'];
            break;
        }
        case 'Thursday': {
            daysArray = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'];
            break;
        }
        case 'Friday': {
            daysArray = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
            break;
        }
        case 'Saturday': {
            daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
            break;
        }
    }
    return daysArray;
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

//Reformats current date from current weather API to be searchable in 5 day API
// 7/1/2019 ---> 2019-07-01
function reformatCurrentDate(currentDate) {
    currentDateSplit = currentDate.split('/');
    let currentDateReformat;
    //If months is less than 9 add a zero
    if(currentDateSplit[0] < 9) {
        currentDateReformat = currentDateSplit[2] + '-0' + currentDateSplit[0];
    } else {
        currentDateReformat = currentDateSplit[2] + '-' + currentDateSplit[0];
    }
    //If day is less than 9 add a zero
    if(currentDateSplit[1] < 9) {
        currentDateReformat += '-0' + currentDateSplit[1];
    }
    else {
        currentDateReformat += '-' + currentDateSplit[1];
    }
    return currentDateReformat;
}