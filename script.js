let cityInput = document.getElementById('city_input'),
searchBtn = document.getElementById('searchBtn'),
locationBtn = document.getElementById('locationBtn'),
api_key = '9694f0fcb3c2a45270f3c0061266a88c',
currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
fiveDaysForecastCard = document.querySelector('.day-forecast'),
aqiCard = document.querySelectorAll('.highlights .card')[0],
sunriseCard = document.querySelectorAll('.highlights .card')[1],
humidityVal = document.getElementById('humidityVal'),
pressureVal = document.getElementById('pressureVal'),
visibility = document.getElementById('visibility'),
windSpeedVal = document.getElementById('windSpeedVal'),
feelsVal = document.getElementById('feelsVal'),
hourlyForecastCard = document.querySelector('.hourly-forecast'),
aqiList = ['Tốt', 'Vừa', 'Vừa Phải', 'Tệ', 'Rất Tệ'];


function getWeatherDetails(name, lat, lon, country, state)
{
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
    days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
    months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let {co, no, no2, o3, pm10, pm2_5, so2, nh3} = data.list[0].components;
        aqiCard.innerHTML = `
        <div class="card-head">
            <p>Chất Lượng Không Khí</p>
            <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi -1]}</p>
        </div>
        <div class="air-indices">
            <i class="bi bi-wind"></i>
            <div class="item">
                <p>PM2.5</p>
                <h2>${pm2_5}</h2>
            </div>
            <div class="item">
                <p>PM10</p>
                <h2>${pm10}</h2>
            </div>
            <div class="item">
                <p>SO2</p>
                <h2>${so2}</h2>
            </div>
            <div class="item">
                <p>CO</p>
                <h2>${co}</h2>
            </div>
            <div class="item">
                <p>NO</p>
                <h2>${no}</h2>
            </div>
            <div class="item">
                <p>NO2</p>
                <h2>${no2}</h2>
            </div>
            <div class="item">
                <p>NH3</p>
                <h2>${nh3}</h2>
            </div>
            <div class="item">
                <p>O3</p>
                <h2>${o3}</h2>
            </div>
        </div>
        `;
    }).catch(() => {
        alert('Lỗi khi lấy dữ liệu chất lượng không khí. Vui lòng thử lại.');
    });

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Bây Giờ</p>
                    <h2>${Math.round(data.main.temp - 273.15)}&deg;C</h2>
                    <p>${(data.weather[0].description)}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="bi bi-calendar"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="bi bi-geo-alt-fill"></i>${name}, ${country}</p>
            </div>
        `;
        let {sunrise, sunset} = data.sys,
            {timezone , visibility:visVal} = data,
            {humidity, pressure, feels_like} = data.main,
            {speed} = data.wind,
            sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
            sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
        sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Mặt Trời Lặn & Mọc</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="bi bi-sunrise-fill"></i>
                    </div>
                    <div>
                        <p>Mặt Trời Mọc</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="bi bi-sunset"></i>
                    </div>
                    <div>
                        <p>Mặt Trời Lặn</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
                        </div>
        `;
        humidityVal.innerHTML = `${humidity}%`;
        pressureVal.innerHTML = `${pressure} hPa`;
        visibility.innerHTML = `${visVal / 1000} km`;
        windSpeedVal.innerHTML = `${speed} m/s`;
        feelsVal.innerHTML = `${Math.round(feels_like - 273.15)}&deg;C`;
    }).catch(() => {
        alert('Lỗi khi lấy dữ liệu mặt trời mọc & lặn. Vui lòng thử lại.');
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let today = new Date().getDate();
        let hourlyForecast = data.list.filter(item => {
            return new Date(item.dt_txt).getDate() === today;
        });

        hourlyForecastCard.innerHTML = '';

        for (let i = 0; i < 8 && i < hourlyForecast.length; i++) {
            let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = 'AM';

            if (hr === 0) {
                hr = 12;
            } else if (hr === 12) {
                a = 'PM';
            } else if (hr > 12) {
                hr -= 12;
                a = 'PM';
            }
            hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${Math.round(hourlyForecast[i].main.temp -273.15)}&deg;C</p>
                </div>
            `;
        }
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        fiveDaysForecastCard.innerHTML = '';
        for(let i =1; i < fiveDaysForecast.length; i++) {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                        <span>${Math.round(fiveDaysForecast[i].main.temp - 273.15)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert('Lỗi khi lấy dữ liệu dự báo thời tiết. Vui lòng thử lại.');
    });

}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert('Không tìm thấy thành phố. Vui lòng kiểm tra lại tên thành phố.');
    });
}

function getUserCoordinates()
{
    navigator.geolocation.getCurrentPosition((position) => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            let {name, country, state} = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            alert('Không thể lấy thông tin vị trí. Vui lòng thử lại.');
        });
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Quyền bị từ chối. Vui lòng cho phép truy cập vị trí.');
        }
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click',getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);