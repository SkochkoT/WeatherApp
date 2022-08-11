function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="minicard col-2">
                <h5 class="forecast-date">${formatDay(forecastDay.dt)}</h5>
                <img
                  src="icons/${forecastDay.weather[0].icon}.svg"
                  class="forecast-icon"
                  alt=""
                  width="60px"
                />
                <div class="forecast-temp">
                  <span class="maxtemp"> ${Math.round(
                    forecastDay.temp.max
                  )}° /</span>
                  <span class="mintemp"> ${Math.round(
                    forecastDay.temp.min
                  )}° </span>
                </div>
              </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c475d7b28899306359b30750ca522e5c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showWeather(response) {
  let currentCity = document.querySelector("h1");
  let showTemp = document.querySelector("#temperature");
  let showWeather = document.querySelector("#weather");
  let showHumidity = document.querySelector("#humidity");
  let showWind = document.querySelector("#wind");
  let dayTime = document.querySelector("#day-time");
  let showIcon = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.main.temp;

  currentCity.innerHTML = response.data.name;
  showTemp.innerHTML = Math.round(celsiusTemperature);
  showWeather.innerHTML = response.data.weather[0].main;
  showHumidity.innerHTML = response.data.main.humidity;
  showWind.innerHTML = Math.round(response.data.wind.speed);
  dayTime.innerHTML = formatDate(response.data.dt * 1000);
  showIcon.setAttribute("src", `icons/${response.data.weather[0].icon}.svg`);
  showIcon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(nameOfCity) {
  let apiKey = "c475d7b28899306359b30750ca522e5c";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${nameOfCity}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showWeather);
}

function showCity(event) {
  event.preventDefault();
  let nameOfCity = document.querySelector("#search-city-form").value;
  search(nameOfCity);
}

function showPosition(position) {
  let apiKey = "c475d7b28899306359b30750ca522e5c";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showWeather);
}

function currentLocation(event) {
  event.preventDefault;
  navigator.geolocation.getCurrentPosition(showPosition);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheit = celsiusTemperature * 1.8 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheit);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  //let celsius = (temperatureElement.innerHTML - 32) / 1.8;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let city = document.querySelector("#search-form");
city.addEventListener("submit", showCity);

let currentPosition = document.querySelector("#current-location");
currentPosition.addEventListener("click", currentLocation);

search("Kyiv");
