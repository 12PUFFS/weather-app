const API_KEY = 'b0d1848cc171b5865984b38e95b85dbe'; // В реальном проекте лучше хранить ключ в .env
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const weatherForm = document.getElementById('weather-form');
const switchBg = document.getElementById('switch-bg');

// Цветовые темы
const themes = [
  { bg: '#f0f8ff', text: '#333' },
  { bg: '#ffe4e1', text: '#333' },
  { bg: '#e0ffff', text: '#333' },
  { bg: '#f5f5dc', text: '#333' },
  { bg: '#222', text: '#fff' }, // Темная тема
];

// Текущий индекс темы
let currentThemeIndex = 0;

// Инициализация темы из localStorage
const savedThemeIndex = localStorage.getItem('themeIndex');
if (savedThemeIndex) {
  currentThemeIndex = parseInt(savedThemeIndex);
  applyTheme(currentThemeIndex);
}

// Переключение темы
switchBg.addEventListener('click', () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  applyTheme(currentThemeIndex);
  localStorage.setItem('themeIndex', currentThemeIndex.toString());
});

function applyTheme(index) {
  document.body.style.backgroundColor = themes[index].bg;
  document.body.style.color = themes[index].text;
}

// Загрузка последнего города
const lastCity = localStorage.getItem('lastCity');
if (lastCity) {
  cityInput.value = lastCity;
  getWeather();
}

// Получение погоды
async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Введите название города');
    return;
  }

  try {
    weatherResult.innerHTML = '<div class="loading">Загрузка...</div>';

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
    );

    const data = await response.json();

    if (data.cod === 200) {
      displayWeather(data);
      localStorage.setItem('lastCity', city);
    } else {
      showError('Город не найден');
    }
  } catch (error) {
    showError('Ошибка соединения');
    console.error('Fetch error:', error);
  }
}

function displayWeather(data) {
  const { weather, main, wind, name } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  weatherResult.innerHTML = `
    <div class="weather-card">
      <h2>${name}</h2>
      <img src="${iconUrl}" alt="${
    weather[0].description
  }" class="weather-icon">
      <p class="weather-desc">${weather[0].description}</p>
      <div class="weather-details">
        <p><i class="fas fa-thermometer-half"></i> Температура: ${
          main.temp
        }°C</p>
        <p><i class="fas fa-temperature-low"></i> Ощущается как: ${
          main.feels_like
        }°C</p>
        <p><i class="fas fa-tint"></i> Влажность: ${main.humidity}%</p>
        <p><i class="fas fa-wind"></i> Ветер: ${wind.speed} м/с</p>
        <p><i class="fas fa-tachometer-alt"></i> Давление: ${Math.round(
          main.pressure / 1.333
        )} мм рт.ст.</p>
      </div>
    </div>
  `;
}

function showError(message) {
  weatherResult.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    </div>
  `;
}

// Обработчики событий
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  getWeather();
});

// Добавляем Font Awesome для иконок
const faScript = document.createElement('script');
faScript.src = 'https://kit.fontawesome.com/your-code.js';
faScript.crossOrigin = 'anonymous';
document.head.appendChild(faScript);
