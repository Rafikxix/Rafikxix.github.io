const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");


const cityDisplay = document.createElement("h1")
cityDisplay.classList.add("cityDisplay");

const tempDisplay = document.createElement("p")
tempDisplay.classList.add("tempDisplay");

const humidityDisplay = document.createElement("p")
humidityDisplay.classList.add("humidityDisplay");

const sunriseDisplay = document.createElement("p");
sunriseDisplay.classList.add("timeDisplay");

const sunsetDisplay = document.createElement("p");
sunsetDisplay.classList.add("timeDisplay");

const descDisplay = document.createElement("p");
descDisplay.classList.add("descDisplay");

const weatherEmoji = document.createElement("p");
weatherEmoji.classList.add("weatherEmoji");


const apiKey= "ddaf32989073ff4563b6c73d14327191";

weatherForm.addEventListener("submit" ,async event =>{
    event.preventDefault();
    const city = cityInput.value;
    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }catch(error)
        {
            console.error(error)
            displayError(error)
        }
    }
    else{
        displayError("Please enter a valid city name")
    }
})

async function getWeatherData(city){
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiURL)
    if(!response.ok)
    {
        throw new Error("could not fetch weather data")
    }
    return await response.json();
}

function displayWeatherInfo(data){
    let offset = new Date().getTimezoneOffset();
    offset = -offset;
    const {name: city,sys:{country,id_,sunrise,sunset}, main: {temp, humidity}, weather: [{description, id}]} = data; //destructuring
    card.textContent = "";
    card.style.display = "flex";
    cityDisplay.textContent = `${city}(${getFlagEmoji(country)})`;
    const sunrise_date = new Date(0,0,0,0,0,sunrise);
    const sunset_date = new Date(0,0,0,0,0,sunset);
    sunriseDisplay.textContent = `🌇 Sunrise: ${sunrise_date.getHours().toString().padStart(2,0)}:${sunrise_date.getMinutes().toString().padStart(2,0)}:${sunrise_date.getSeconds().toString().padStart(2,0)} (UTC ${offset > 0 ? `+${(offset/60).toString().padStart(2,0)}`: (offset/60).toString().padStart(2,0)})`
    sunsetDisplay.textContent = `🌆 Sunset: ${sunset_date.getHours().toString().padStart(2,0)}:${sunset_date.getMinutes().toString().padStart(2,0)}:${sunset_date.getSeconds().toString().padStart(2,0)} (UTC ${offset > 0 ? `+${(offset/60).toString().padStart(2,0)}`: (offset/60).toString().padStart(2,0)})`
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C | ${(((temp - 273.15) * 1.8) + 32).toFixed(1)}°F`;
    humidityDisplay.textContent = `💦 Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(sunriseDisplay);
    card.appendChild(sunsetDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            card.style.color= "black";
            card.style.backgroundImage = "url(images/thunderstorm-and-lightning.webp)";
            card.style.backgroundPosition = "0px 50px";
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            card.style.color= "black";
            card.style.backgroundImage = "url(images/rainy.jpg)";
            return "🌨️";
        case (weatherId >= 500 && weatherId < 600):
            card.style.color= "black";
            card.style.backgroundImage = "url(images/rainy.jpg)";
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            card.style.color= "black";
            card.style.backgroundPosition = "0px 50px";
            card.style.backgroundImage = "url(images/snowy.jpg)";
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            card.style.color= "black";
            card.style.backgroundImage = "url(images/misty.jpg)";
            return "🌫️";
        case (weatherId == 800):
            card.style.color= "black";
            card.style.backgroundImage = "url(images/clearsky2.jpg)";
            return "🌞";
        case (weatherId > 800 && weatherId <= 809):
            card.style.color= "white";
            card.style.backgroundPosition = "-3900px";
            card.style.backgroundImage = "url(images/cloudysky.jpg)";
            return "☁️";
        default:
            return "?";

    }
}


function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay")

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay)
    
}

function getFlagEmoji(countryCode) {
    return countryCode.toUpperCase().replace(/./g, char => 
        String.fromCodePoint(127397 + char.charCodeAt())
    );
  }
