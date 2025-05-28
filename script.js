let cityInput = document.getElementById('city_input'),
searchBtn = document.getElementById('searchBtn'),
locationBtn = document.getElementById('locationBtn'),
api_key = 'cf2eae3406b4416da84143933252705',
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
    let FORECAST_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=6&aqi=no&alerts=no`;
    WEATHER_API_URL = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}&aqi=no`,
    AIR_POLLUTION_API_URL = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${lat},${lon}&aqi=yes`;
    days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
    months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
    let air = data.current.air_quality;
    let usAqi = air["us-epa-index"]; // Chỉ số AQI từ EPA Hoa Kỳ
    let aqiClass = `aqi-${usAqi}`;
    let aqiLabel = aqiList[usAqi - 1] || "Không rõ";

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
    }).catch(() => {
        alert('Lỗi khi lấy dữ liệu chất lượng không khí. Vui lòng thử lại.');
    });

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Bây Giờ</p>
                    <h2>${Math.round(data.current.temp_c)}&deg;C</h2>
                    <p>${data.current.condition.text}</p>
                </div>
                <div class="weather-icon">
                    <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="bi bi-calendar"></i>${days[new Date(data.location.localtime).getDay()]}, ${new Date(data.location.localtime).getDate()} ${months[new Date(data.location.localtime).getMonth()]} ${new Date(data.location.localtime).getFullYear()}</p>
                <p><i class="bi bi-geo-alt-fill"></i>${data.location.name}, ${data.location.country}</p>
            </div>
        `;
        humidityVal.innerHTML = `${data.current.humidity}%`;
        pressureVal.innerHTML = `${data.current.pressure_mb} hPa`;
        visibility.innerHTML = `${data.current.vis_km} km`;
        windSpeedVal.innerHTML = `${data.current.wind_kph} km/h`;
        feelsVal.innerHTML = `${Math.round(data.current.feelslike_c)}&deg;C`;
    }).catch(() => {
        alert('Lỗi khi lấy dữ liệu mặt trời mọc & lặn. Vui lòng thử lại.');
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let today = new Date().getDate();
        const hourlyForecast = data.forecast.forecastday[0].hour;

        hourlyForecastCard.innerHTML = '';

        for (let i = 0; i < 8 && i < hourlyForecast.length; i++) {
            let hrForecastDate = new Date(hourlyForecast[i].time);
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
            let iconUrl = "https:" + hourlyForecast[i].condition.icon;
            let tempC = Math.round(hourlyForecast[i].temp_c);
            hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="${iconUrl}" alt="${hourlyForecast[i].condition.text}">
                    <p>${tempC}&deg;C</p>
                </div>
            `;
        }
        let fiveDaysForecast = data.forecast.forecastday;
        fiveDaysForecastCard.innerHTML = '';

        for (let i = 1; i < fiveDaysForecast.length; i++) {
            let forecast = fiveDaysForecast[i];
            let date = new Date(forecast.date);
            let iconUrl = "https:" + forecast.day.condition.icon;
            let avgTempC = Math.round(forecast.day.avgtemp_c);

            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="${iconUrl}" alt="${forecast.day.condition.text}">
                        <span>${avgTempC}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
        let {sunrise, sunset} = data.forecast.forecastday[0].astro;
        sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Mặt Trời Mọc & Lặn</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="bi bi-sunrise-fill"></i>
                    </div>
                    <div>
                        <p>Mặt Trời Mọc</p>
                        <h2>${sunrise}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="bi bi-sunset"></i>
                    </div>
                    <div>
                        <p>Mặt Trời Lặn</p>
                        <h2>${sunset}</h2>
                    </div>
                </div>
            </div>
        `;
    }).catch(() => {
        alert('Lỗi khi lấy dữ liệu dự báo thời tiết. Vui lòng thử lại.');
    });

}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    let GEOCODING_API_URL = `https://api.weatherapi.com/v1/search.json?key=${api_key}&q=${encodeURIComponent(cityName)}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert('Không tìm thấy thành phố. Vui lòng kiểm tra lại tên thành phố.');
    });
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        // Gọi luôn API search.json để lấy tên thành phố
        let GEOCODING_API_URL = `https://api.weatherapi.com/v1/search.json?key=${api_key}&q=${lat},${lon}`;

        fetch(GEOCODING_API_URL)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    let { name, country, state } = data[0];
                    getWeatherDetails(name, lat, lon, country, state);
                } else {
                    alert("Không tìm thấy thông tin vị trí.");
                }
            })
            .catch(() => {
                alert('Lỗi khi lấy thông tin vị trí. Vui lòng thử lại.');
            });
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Bạn đã từ chối quyền truy cập vị trí.');
        } else {
            alert('Không thể lấy vị trí. Vui lòng kiểm tra lại trình duyệt.');
        }
    });
}


searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click',getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);