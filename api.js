const API_KEY = 'b0d1848cc171b5865984b38e95b85dbe'; // Замени на свой ключ
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const weatherForm = document.getElementById('weather-form'); // Добавлен ID формы в HTML

// Загружаем последний город при загрузке страницы
const lastCity = localStorage.getItem('lastCity');
if (lastCity) {
  cityInput.value = lastCity;
  getWeather(); // Заменяем searchBtn.click() на прямой вызов функции
}

// Функция для получения погоды
function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        const weather = data.weather[0];
        const main = data.main;
        const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

        weatherResult.innerHTML = `
          <h2>${data.name}</h2>
          <img src="${iconUrl}" alt="${weather.description}">
          <p>${weather.description}</p>
          <p>Температура: ${main.temp}°C</p>
          <p>Ощущается как: ${main.feels_like}°C</p>
          <p>Влажность: ${main.humidity}%</p>
          <p>Ветер: ${data.wind.speed} м/с</p>
          <p>Давление: ${Math.round(main.pressure / 1.333)} мм рт.ст.</p>
        `;

        // Сохраняем город только после успешного запроса
        localStorage.setItem('lastCity', city);
      } else {
        weatherResult.innerHTML =
          '<p style="position: absolute;  top: 50%; left: 50%; transform: translate(-50%, -50%);">Город не найден</p>';
      }
    })
    .catch((error) => {
      weatherResult.innerHTML = `<p>Ошибка: ${error.message}</p>`;
    });
}

// Обработчик отправки формы
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Предотвращаем стандартную отправку формы
  getWeather();
});
