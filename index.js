const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const background = document.querySelector("#background");


const cityDisplay = document.createElement("h1")
cityDisplay.classList.add("cityDisplay");

const tempDisplay = document.createElement("p")
tempDisplay.classList.add("tempDisplay");

const humidityDisplay = document.createElement("p")
humidityDisplay.classList.add("humidityDisplay");

const windDisplay = document.createElement("p")
windDisplay.classList.add("humidityDisplay");

const localTimeDisplay = document.createElement("p");
localTimeDisplay.classList.add("timeDisplay");

const sunriseDisplay = document.createElement("p");
sunriseDisplay.classList.add("timeDisplay");

const sunsetDisplay = document.createElement("p");
sunsetDisplay.classList.add("timeDisplay");

const descDisplay = document.createElement("p");
descDisplay.classList.add("descDisplay");

const weatherEmoji = document.createElement("p");
weatherEmoji.classList.add("weatherEmoji");

let local_date,sunset_date, sunrise_date;


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
    console.log(data)
    // let offset = new Date().getTimezoneOffset();
    // offset = -offset;
    let {name: city,sys:{country,id_,sunrise,sunset}, main: {temp,temp_max,temp_min, humidity},timezone: offset, weather: [{description, id}],wind: {speed}} = data; //destructuring
    card.textContent = "";
    card.style.display = "flex";
    cityDisplay.textContent = `${city}(${getFlagEmoji(country)})`;
    sunrise_date = new Date(0,0,0,0,0,sunrise+offset);
    sunset_date = new Date(0,0,0,0,0,sunset+offset);
    local_date = new Date();
    if(local_date.getHours() >= 12)
        local_time = (local_date.getHours()+offset/3600-1)%24;
    else
        local_time = (local_date.getHours()+offset/3600+23)%24;
    local_date.setHours(local_time);
    sunrise_date.setFullYear(local_date.getFullYear())
    sunset_date.setFullYear(local_date.getFullYear())
    localTimeDisplay.textContent = `🕛 Local time: ${local_time.toString().padStart(2,0)}:${local_date.getMinutes().toString().padStart(2,0)}:${local_date.getSeconds().toString().padStart(2,0)}`
    sunriseDisplay.textContent = `🌇 Sunrise time: ${sunrise_date.getHours().toString().padStart(2,0)}:${sunrise_date.getMinutes().toString().padStart(2,0)}:${sunrise_date.getSeconds().toString().padStart(2,0)}` //(UTC ${offset > 0 ? `+${(offset/60).toString().padStart(2,0)}`: (offset/60).toString().padStart(2,0)})`
    sunsetDisplay.textContent = `🌆 Sunset time: ${sunset_date.getHours().toString().padStart(2,0)}:${sunset_date.getMinutes().toString().padStart(2,0)}:${sunset_date.getSeconds().toString().padStart(2,0)}` //(UTC ${offset > 0 ? `+${(offset/60).toString().padStart(2,0)}`: (offset/60).toString().padStart(2,0)})`
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C | ${(((temp - 273.15) * 1.8) + 32).toFixed(1)}°F`;
    humidityDisplay.textContent = `💦 Humidity: ${humidity}%`;
    speed = speed*3600/1000;
    windDisplay.textContent = `Wind speed: ${speed.toFixed(2)} km/h | ${(speed/1.609344).toFixed(2)} mi/h`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(windDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(localTimeDisplay);
    card.appendChild(sunriseDisplay);
    card.appendChild(sunsetDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            if(local_date > sunrise_date && local_date < sunset_date)
            {
                card.style.color= "black";
                card.style.backgroundPosition = "0px 50px";
                card.style.backgroundImage = "url(images/thunderstorm-and-lightning.webp)";
                background.style.backgroundImage = "url(images/thunderstormnight.jpg)";
                
            }
            else{
                card.style.color= "black";
                card.style.backgroundPosition = "-300px 0px";
                card.style.backgroundImage = "url(images/thunderstormnight.jpg)";
                background.style.backgroundImage = "url(images/thunderstormnight.jpg)";
            }
            
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            if(local_date > sunrise_date && local_date < sunset_date)
            {
                card.style.color= "black";
                card.style.backgroundPosition = "center";
                card.style.backgroundImage = "url(images/rainy.jpg)";
                background.style.backgroundImage = "url(images/cloudysky.jpg)";
            }
            else{
                card.style.color= "white";
                card.style.backgroundPosition = "center";
                card.style.backgroundImage = "url(images/rainynight.jpg)";
                background.style.backgroundImage = "url(images/rainynight.jpeg)";
            }
            return "🌨️";
        case (weatherId >= 500 && weatherId < 600):
            if(local_date > sunrise_date && local_date < sunset_date)
            {
                card.style.color= "black";
                card.style.backgroundPosition = "center";
                card.style.backgroundImage = "url(images/heavyrainy.jpg)";
                background.style.backgroundImage = "url(images/cloudysky.jpg)";
            }
            else
            {
                card.style.color= "white";
                card.style.backgroundPosition = "0px";
                card.style.backgroundImage = "url(images/heavyrainnight.jpg)";
                background.style.backgroundImage = "url(images/rainynight.jpeg)";
            }
            
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            if(local_date > sunrise_date && local_date < sunset_date)
            {
                card.style.color= "black";
                card.style.backgroundPosition = "center";
                card.style.backgroundImage = "url(images/snowy.jpg)";
                background.style.backgroundImage = "url(images/snowy.jpg)";
            }
            else{
                card.style.color= "black";
                card.style.backgroundImage = "url(images/snowynight.jpg)";
                background.style.backgroundImage = "url(images/snowynight.jpg)";
            }
            
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            if(local_date > sunrise_date && local_date < sunset_date)
            {
                card.style.color= "black";
                card.style.backgroundPosition = "center";
                card.style.backgroundImage = "url(images/misty.jpg)";
                background.style.backgroundImage = "url(images/misty.jpg)";
            }
            else{
                card.style.color= "black";
                card.style.backgroundPosition = "center";
                card.style.backgroundImage = "url(images/mistynight.jpeg)";
                background.style.backgroundImage = "url(images/mistynight.jpeg)";
            }
            
            return "🌫️";
        case (weatherId == 800):
            if(local_date > sunrise_date && local_date < sunset_date)
            {
                card.style.color= "black";
                card.style.backgroundPosition = "-200px";
                card.style.backgroundImage = "url(images/clearsky2.jpg)";
                background.style.backgroundImage = "url(images/clearsky2.jpg)";
                return "☀️";
            }
            else{
                card.style.color= "white";
                card.style.backgroundPosition = "-500px";
                card.style.backgroundImage = "url(images/clearskynight2.jpg)";
                background.style.backgroundImage = "url(images/clearskynight2.jpg)";
                return "🌒";
            }
            
            
        case (weatherId > 800 && weatherId <= 809):
            if(local_date > sunrise_date && local_date < sunset_date)
            {
                card.style.color= "white";
                card.style.backgroundPosition = "-200px";
                card.style.backgroundImage = "url(images/cloudysky.jpg)";
                background.style.backgroundImage = "url(images/cloudysky.jpg)";
                return "☁️";
            }
            else{
                card.style.color= "white";
                card.style.backgroundPosition = "-300px";
                card.style.backgroundImage = "url(images/cloudynightsky.jpg)";
                background.style.backgroundImage = "url(images/cloudynightsky.jpg)";
                return "☁️";
            }
            
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
    card.style.backgroundImage ="";
    card.style.backgroundPosition = "center";
    card.appendChild(errorDisplay)
    
}

function getFlagEmoji(countryCode) {
    return countryCode.toUpperCase().replace(/./g, char => 
        String.fromCodePoint(127397 + char.charCodeAt())
    );
  }
