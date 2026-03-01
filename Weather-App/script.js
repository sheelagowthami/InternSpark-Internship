const apiKey = "0a68a44998c012a0128408d3730ab99e";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    loading.classList.remove("hidden");
    weatherCard.classList.add("hidden");
    errorDiv.classList.add("hidden");

    try {
        const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        displayWeather(data);

    } catch (error) {
        showError("City not found. Please try again.");
    } finally {
        loading.classList.add("hidden");
    }
}

function displayWeather(data) {
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temperature").innerText = 
        `🌡 Temperature: ${data.main.temp} °C`;
    document.getElementById("description").innerText = 
        `☁ Condition: ${data.weather[0].description}`;
    document.getElementById("humidity").innerText = 
        `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = 
        `🌬 Wind Speed: ${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src = 
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherCard.classList.remove("hidden");
}

function showError(message) {
    errorDiv.innerText = message;
    errorDiv.classList.remove("hidden");
}
