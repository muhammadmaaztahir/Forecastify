const APIKey = '7VP7SG2ZNS6YQVAL8D9GK2D5D';
const defaultCity = 'Karachi';
const APIEndpoint = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${defaultCity}?unitGroup=metric&key=${APIKey}&contentType=json`;

document.addEventListener('DOMContentLoaded', function () {

    fetchData(defaultCity);

    async function fetchData(cityName) {
        const newAPIEndpoint = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&key=${APIKey}&contentType=json`;
        try {
            const response = await fetch(newAPIEndpoint);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            updateUI(data, data.resolvedAddress);
            // console.log(data);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            handleInvalidCity();
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            const cityInput = document.getElementById('cityInput');
            const cityName = cityInput.value.trim();

            if (cityName === '') {
                return;
            }
            fetchData(cityName);
            cityInput.value = '';
            validSearchPerformed = true;
        }
    }
    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('keypress', handleKeyPress);

    function handleInvalidCity() {
        document.getElementById('cityName').textContent = '';
        const weatherIconElement = document.querySelector('.weather-icon');
        weatherIconElement.style.display = 'none';
        document.getElementById('invalidCityMsg').style.display = 'inline';
        validSearchPerformed = false;
        clearWeatherData();
    }
    function clearWeatherData() {
        document.getElementById('temp').textContent = '';
        document.getElementById('condition').textContent = '';
        document.getElementById('description').textContent = '';
        document.getElementById('fl').textContent = '';
        document.getElementById('hum').textContent = '';
        document.getElementById('sr').textContent = '';
        document.getElementById('ss').textContent = '';
        document.getElementById('prec').textContent = '';
        document.getElementById('uv').textContent = '';
        document.getElementById('ws').textContent = '';
        document.getElementById('gusts').textContent = '';
        document.getElementById('vis').textContent = '';
        document.getElementById('uvCondition').textContent = '';
        document.getElementById('daily_forecast_data').innerHTML = '';
        document.getElementById('hourly_forecast_data').innerHTML = '';
        document.getElementById('wd').innerHTML = '';
        document.querySelector('.location').style.display = 'none';
        // document.getElementById('invalidCityMsg').style.display = 'none';
        hideWindAndGustsUnits();
    }

    function hideWindAndGustsUnits() {
        document.querySelector('.hr').style.display = 'none';
        document.querySelector('.hr_2').style.display = 'none';
        document.querySelector('.windUnits').style.display = 'none';
        document.querySelector('.gustsUnits').style.display = 'none';
        document.querySelector('.directionUnits').style.display = 'none';
        document.querySelectorAll(".unit2").forEach(element => {
            element.style.display = 'none';
        });
    }

    function updateUI(data, cityName) {
        let temperature = data.currentConditions.temp;
        let condition = data.currentConditions.conditions;
        let description = data.description;
        let feelsLike = data.currentConditions.feelslike;
        let visibility = data.currentConditions.visibility;
        let humidity = data.currentConditions.humidity;
        let sunrise = convertTimeTo12HourFormat(data.currentConditions.sunrise);
        let sunset = convertTimeTo12HourFormat(data.currentConditions.sunset);
        let precipitation = data.currentConditions.precip;
        let uvIndex = data.currentConditions.uvindex;
        let windSpeed = data.currentConditions.windspeed;
        let gusts = data.currentConditions.windgust;
        let windDirection = data.currentConditions.winddir;

        document.getElementById('cityName').textContent = cityName;
        document.getElementById('temp').innerHTML = `${temperature}<sup>°</sup>`;
        document.getElementById('condition').textContent = condition;
        document.getElementById('description').textContent = description;
        document.getElementById('fl').innerHTML = `${feelsLike}<unit><sup>°</sup></unit>`;
        document.getElementById('hum').innerHTML = `${humidity}<unit>%</unit>`;
        document.getElementById('sr').innerHTML = `${sunrise}`;
        document.getElementById('ss').innerHTML = `${sunset}`;
        document.getElementById('prec').innerHTML = `${precipitation}`;
        document.getElementById('wd').innerHTML = `${windDirection}`;
        document.getElementById('uv').textContent = uvIndex;
        // document.querySelector('wind_par').innerHTML = `
        // <div>
        //     <h1 id="ws">${windSpeed}</h1>
        // </div>
        // <div class="windUnits">
        //     <p>KM/H</p>
        //     <p>Wind</p>
        // </div>`;
        document.getElementById('ws').textContent = windSpeed;
        document.getElementById('invalidCityMsg').style.display = 'none';

        if (visibility == null) {
            document.getElementById('vis').textContent = '-';
        }
        else {
            document.getElementById('vis').innerHTML = `${visibility}<unit>mi</unit>`;
        }

        if (precipitation === null) {
            document.getElementById('prec').innerHTML = "-"
        }
        else {
            document.getElementById('prec').innerHTML = `${precipitation}<unit>"</unit>`;
        }

        if (gusts == null) {
            document.getElementById('gusts').innerText = windSpeed;
        }
        else {
            document.getElementById('gusts').innerText = gusts;
        }


        if (uvIndex >= 0 && uvIndex <= 2) {
            document.getElementById('uvCondition').innerText = "Low";
        }
        else if (uvIndex >= 3 && uvIndex <= 5) {
            document.getElementById('uvCondition').innerText = "Moderate";
        }
        else if (uvIndex >= 6 && uvIndex <= 7) {
            document.getElementById('uvCondition').innerText = "High";
        }
        else if (uvIndex >= 8 && uvIndex <= 10) {
            document.getElementById('uvCondition').innerText = "Very High";
        }
        else if (uvIndex >= 11) {
            document.getElementById('uvCondition').innerText = "Extreme";
        }
        else {
            document.getElementById('uvCondition').innerText = "-";
        }

        // current day 24-hours data
        let hourlyData = data.days[0].hours;
        let hourlyContainer = document.getElementById("hourly_forecast_data");

        hourlyContainer.innerHTML = "";
        hourlyData.forEach((v) => {
            let hourDiv = document.createElement('div')
            hourDiv.className = "hour";

            let hour = v.datetime
            let hourlyTemp = v.temp
            let hourlyTempIcon = "Icons/" + v.icon + ".png";

            let currentTime = hour;
            let formattedTime = convertTimeTo12HourFormat(currentTime);

            hourDiv.innerHTML = `
            <p>${formattedTime}</p>
                <h3>${hourlyTemp}<unit><sup>°</sup></unit></h3>
                    <div>
                        <img src="${hourlyTempIcon}" alt="icon" class="weather-icon" height="25"
                         width="25">
                    </div>`;

            hourlyContainer.appendChild(hourDiv)
        });

        const apiDate = "2024-01-02";
        const dayOfWeek = getDayOfWeek(apiDate);

        //10-days data
        let dailyData = data.days;
        let container = document.getElementById("daily_forecast_data");

        container.innerHTML = "";
        let currentDate = new Date();

        for (let i = 0; i < 10; i++) {
            let dayDiv = document.createElement("div");
            dayDiv.className = "day";
            let dayOfWeek = isToday(currentDate, new Date(dailyData[i].datetime)) ? "Today" : getDayOfWeek(dailyData[i].datetime);
            let formattedDate = formatDate(new Date(dailyData[i].datetime));
            let temperature = dailyData[i].temp;
            let iconSrc = "Icons/" + dailyData[i].icon + ".png"; // Assuming icon names match your file names

            dayDiv.innerHTML = `
        <p>${dayOfWeek}</p>
        <span>${formattedDate}</span>
        <h3>${temperature}<unit><sup>°</sup></unit></h3>
        <div>
            <img src="${iconSrc}" alt="icon" class="weather-icon" height="25" width="25">
        </div>`;

            if (isToday(currentDate, new Date(dailyData[i].datetime))) {
                dayDiv.classList.add("active");
            }
            function formatDate(date) {
                let day = date.getDate().toString().padStart(2, '0');
                let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
                return `${day}/${month}`;
            }
            container.appendChild(dayDiv);
        }

        function showWindAndGustsUnits() {
            document.querySelector('.hr_2').style.display = 'inline';
            document.querySelector('.directionUnits').style.display = 'inline';
            document.querySelector('.hr').style.display = 'inline';
            document.querySelector('.windUnits').style.display = 'inline';
            document.querySelector('.gustsUnits').style.display = 'inline';
            document.querySelectorAll(".unit2").forEach(element => {
                element.style.display = 'inline';
            });
        }

        function updateHourlyForecast() {
            const hourlyContainer = document.getElementById("hourly_forecast_data");
            const hours = hourlyContainer.getElementsByClassName("hour");

            const now = new Date();
            const currentHour = now.getHours();
            const nextHourIndex = currentHour >= 23 ? 0 : currentHour + 1;

            for (let i = 0; i < hours.length; i++) {
                hours[i].classList.remove("active");
            }
            hours[nextHourIndex].classList.add("active");
            hours[nextHourIndex].scrollIntoView({ behavior: 'smooth' });
        }

        //function for get day from date
        function getDayOfWeek(dateString) {
            const date = new Date(dateString);
            const options = { weekday: 'long' }
            const dayIndex = date.getDay();
            const dayOfWeek = date.toLocaleDateString('en-US', options);
            return dayOfWeek;
        }

        //function to convert my time
        function convertTimeTo12HourFormat(timeString) {
            const [hour, minute, second] = timeString.split(':').map(Number);
            const time = new Date(0, 0, 0, hour, minute, second);

            let formattedHour = time.getHours();
            const amPm = formattedHour >= 12 ? 'PM' : 'AM';
            formattedHour = formattedHour % 12 || 12;
            const formattedMinute = String(time.getMinutes()).padStart(2, '0');
            return `${formattedHour}:${formattedMinute} ${amPm}`;
        }


        //icon mapping
        const weatherIcon = data.currentConditions.icon;
        const weatherIconElement = document.getElementById("icon")
        const iconMappings = {
            'clear-day': 'Icons/clear-day.png',
            'clear-night': 'Icons/clear-night.png',
            'cloudy': 'Icons/cloudy.png',
            'fog': 'Icons/fog.png',
            'heavy-rain': 'Icons/heavy-rain.png',
            'partly-cloudy-day': 'Icons/partly-cloudy-day.png',
            'partly-cloudy-night': 'Icons/partly-cloudy-night.png',
            'rain': 'Icons/rain.png',
            'showers-day': 'Icons/showers-day.png',
            'showers-night': 'Icons/showers-night.png',
            'snow-showers-day': 'Icons/snow-showers-day.png',
            'snow-showers-night': 'Icons/snow-showers-night.png',
            'snow': 'Icons/snow.png',
            'sunny': 'Icons/sunny.png',
            'thunder-rain': 'Icons/thunder-rain.png',
            'thunder-showers-day': 'Icons/thunder-showers-day.png',
            'thunder-night': 'Icons/thunder-night.png',
            'thunder': 'Icons/thunder.png',
            'wind': 'Icons/wind.png'
        };
        if (iconMappings[weatherIcon]) {
            weatherIconElement.innerHTML = `<img alt="icon" src="${iconMappings[weatherIcon]}" class="weather-icon">`;
            weatherIconElement.style.display = 'inline-block';
        } else {
            weatherIconElement.style.display = 'none';
        }



        // if (iconMappings[weatherIcon]) {
        //     weatherIconElement.src = iconMappings[weatherIcon];
        //     weatherIconElement.style.display = 'inline-block';
        // }

        // else {
        //     weatherIconElement.style.display = 'none';
        // }

        function isToday(date1, date2) {
            return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
        }

        showWindAndGustsUnits();
        updateHourlyForecast();
        setInterval(updateHourlyForecast, 3600000);
    }
})