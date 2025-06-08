
const cityInput = document.getElementById('city_input');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
const fiveDaysForecastCard = document.querySelector('.day-forecast');
const aqiCard = document.querySelectorAll('.highlights .card')[0];
const sunriseCard = document.querySelectorAll('.highlights .card')[1];
const humidityVal = document.getElementById('humidityVal');
const pressureVal = document.getElementById('pressureVal');
const visibility = document.getElementById('visibility');
const windSpeedVal = document.getElementById('windSpeedVal');
const feelsVal = document.getElementById('feelsVal');
const hourlyForecastCard = document.querySelector('.hourly-forecast');
const aqiList = ['Tốt', 'Vừa', 'Vừa Phải', 'Tệ', 'Rất Tệ'];
const API_BASE = 'http://localhost:3000/api/weather';
const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

function getWeatherDetails(lat, lon) {
    fetch(`${API_BASE}/forecast?lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
            const current = data.current;
            const location = data.location;
            const date = new Date(location.localtime);

            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Bây Giờ</p>
                        <h2>${Math.round(current.temp_c)}&deg;C</h2>
                        <p>${current.condition.text}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https:${current.condition.icon}" alt="${current.condition.text}">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="bi bi-calendar"></i>${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="bi bi-geo-alt-fill"></i>${location.name}, ${location.country}</p>
                </div>
            `;

            const air = current.air_quality;
            const usAqi = air['us-epa-index'];
            const aqiClass = `aqi-${usAqi}`;
            const aqiLabel = aqiList[usAqi - 1] || 'Không rõ';

            aqiCard.innerHTML = `
                <div class="card-head">
                    <p>Chất Lượng Không Khí</p>
                    <p class="air-index ${aqiClass}">${aqiLabel}</p>
                </div>
                <div class="air-indices">
                    <i class="bi bi-wind"></i>
                    <div class="item"><p>PM2.5</p><h2>${air.pm2_5.toFixed(1)}</h2></div>
                    <div class="item"><p>PM10</p><h2>${air.pm10.toFixed(1)}</h2></div>
                    <div class="item"><p>SO2</p><h2>${air.so2.toFixed(1)}</h2></div>
                    <div class="item"><p>CO</p><h2>${air.co.toFixed(1)}</h2></div>
                    <div class="item"><p>NO2</p><h2>${air.no2.toFixed(1)}</h2></div>
                    <div class="item"><p>O3</p><h2>${air.o3.toFixed(1)}</h2></div>
                </div>
            `;

            humidityVal.innerHTML = `${current.humidity}%`;
            pressureVal.innerHTML = `${current.pressure_mb} hPa`;
            visibility.innerHTML = `${current.vis_km} km`;
            windSpeedVal.innerHTML = `${current.wind_kph} km/h`;
            feelsVal.innerHTML = `${Math.round(current.feelslike_c)}&deg;C`;

            const { sunrise: sunriseTime, sunset: sunsetTime } = data.forecast.forecastday[0].astro;
            sunriseCard.innerHTML = `
                <div class="card-head"><p>Mặt Trời Mọc & Lặn</p></div>
                <div class="sunrise-sunset">
                    <div class="item"><div class="icon"><i class="bi bi-sunrise-fill"></i></div><div><p>Mặt Trời Mọc</p><h2>${sunriseTime}</h2></div></div>
                    <div class="item"><div class="icon"><i class="bi bi-sunset"></i></div><div><p>Mặt Trời Lặn</p><h2>${sunsetTime}</h2></div></div>
                </div>
            `;

            const hourlyForecast = data.forecast.forecastday[0].hour;
            hourlyForecastCard.innerHTML = '';
            for (let i = 0; i < 8 && i < hourlyForecast.length; i++) {
                const hrForecastDate = new Date(hourlyForecast[i].time);
                let hr = hrForecastDate.getHours();
                let a = 'AM';
                if (hr === 0) hr = 12;
                else if (hr === 12) a = 'PM';
                else if (hr > 12) {
                    hr -= 12;
                    a = 'PM';
                }
                hourlyForecastCard.innerHTML += `
                    <div class="card">
                        <p>${hr} ${a}</p>
                        <img src="https:${hourlyForecast[i].condition.icon}" alt="${hourlyForecast[i].condition.text}">
                        <p>${Math.round(hourlyForecast[i].temp_c)}&deg;C</p>
                    </div>
                `;
            }

            const fiveDaysForecast = data.forecast.forecastday;
            fiveDaysForecastCard.innerHTML = '';
            for (let i = 1; i < fiveDaysForecast.length; i++) {
                const forecast = fiveDaysForecast[i];
                const date = new Date(forecast.date);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https:${forecast.day.condition.icon}" alt="${forecast.day.condition.text}">
                            <span>${Math.round(forecast.day.avgtemp_c)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(() => alert('Lỗi khi lấy dữ liệu từ backend.'));
}

function getCityCoordinates() {
    const cityName = cityInput.value.trim();
    cityInput.value = '';
    const GEOCODING_API_URL = `https://api.weatherapi.com/v1/search.json?key=cf2eae3406b4416da84143933252705&q=${encodeURIComponent(cityName)}`;
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            const { lat, lon } = data[0];
            getWeatherDetails(lat, lon);
        })
        .catch(() => alert('Không tìm thấy thành phố.'));
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude: lat, longitude: lon } = position.coords;
        getWeatherDetails(lat, lon);
    }, error => {
        alert('Không thể lấy vị trí.');
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);
