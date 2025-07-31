async function getWeather() {
  const city = document.getElementById('cityInput').value;

  const card = document.getElementById('weatherCard');
  const name = document.getElementById('cityName');
  const temp = document.getElementById('temperature');
  const desc = document.getElementById('description');
  const sugg = document.getElementById('suggestion');
  const bg = document.getElementById('weatherImage');
  const video = document.getElementById('weatherVideo');

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/weather?city=${city}`);
    const data = await res.json();

    name.innerText = `${data.city}, ${data.country}`;
    temp.innerText = `${data.temperature}°C`;
    document.getElementById("descText").innerText = data.description;
    document.getElementById("weatherIcon").src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
    sugg.innerText = `${data.suggestion}`;

    const condition = data.description.toLowerCase();

    if (condition.includes('snow') || data.temperature <= 0) {
      bg.style.backgroundImage = "url('images/snow.jpg')";
      video.src = 'videos/snow.mp4';
    } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
      bg.style.backgroundImage = "url('images/rain.jpg')";
      video.src = 'videos/rain.mp4';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
      bg.style.backgroundImage = "url('images/thunder.jpg')";
      video.src = 'videos/thunder.mp4';
    } else if (condition.includes('haze') || condition.includes('mist') || condition.includes('fog')) {
      bg.style.backgroundImage = "url('images/haze.jpg')";
      video.src = 'videos/cloudy.mp4';
    } else if (condition.includes('cloud')) {
      bg.style.backgroundImage = "url('images/cloud.jpg')";
      video.src = 'videos/cloudy.mp4';
    } else if (condition.includes('clear')) {
      bg.style.backgroundImage = "url('images/sunny.jpg')";
      video.src = 'videos/sunny.mp4';
    } else {
      bg.style.backgroundImage = "url('images/default.jpg')";
      video.src = 'videos/default.mp4';
    }

    video.load();
    video.play();

    card.classList.remove("hidden");

    const dummyHours = [
      { time: "12 PM", temp: "37°C", desc: "Sunny", icon: "01d" },
      { time: "3 PM", temp: "39°C", desc: "Partly Cloudy", icon: "02d" },
      { time: "6 PM", temp: "40°C", desc: "Cloudy", icon: "03d" },
      { time: "9 PM", temp: "42°C", desc: "Clear", icon: "01n" },
      { time: "12 AM", temp: "36°C", desc: "Clear", icon: "01n" },
      { time: "3 AM", temp: "34°C", desc: "Cloudy", icon: "03n" },
      { time: "6 AM", temp: "31°C", desc: "Cloudy", icon: "03n" }
    ];

    
    const dummyDays = [
      { day: "Sun", temp: "35°C", desc: "Sunny", icon: "01d" },
      { day: "Mon", temp: "34°C", desc: "Partly Cloudy", icon: "02d" },
      { day: "Tue", temp: "33°C", desc: "Cloudy", icon: "03d" },
      { day: "Wed", temp: "40°C", desc: "Rain", icon: "10d" },
      { day: "Thu", temp: "41°C", desc: "Clear", icon: "01d" },
      { day: "Fri", temp: "43°C", desc: "Sunny", icon: "01d" },
      { day: "Sat", temp: "41°C", desc: "Storm", icon: "11d" }
    ];

    // Render HOURLY forecast
    const hourlyContainer = document.getElementById('hourlyContainer');
    hourlyContainer.innerHTML = ''; // Clear previous

    dummyHours.forEach(hour => {
      const box = document.createElement('div');
      box.classList.add('hourly-box');
      box.innerHTML = `
        <strong>${hour.time}</strong><br>
        <img src="http://openweathermap.org/img/wn/${hour.icon}@2x.png" width="40" /><br>
        ${hour.temp}<br><small>${hour.desc}</small>
      `;
      hourlyContainer.appendChild(box);
    });

    // Render WEEKLY forecast
    const weeklyForecastSection = document.getElementById('weeklyForecast');
    weeklyForecastSection.innerHTML = `<h3 class="section-title">Weekly Forecast</h3><div class="weekly-container" id="weeklyContainer"></div>`;

    const weeklyContainer = document.getElementById('weeklyContainer');
    weeklyContainer.innerHTML = ''; // Clear previous

    dummyDays.forEach(day => {
      const box = document.createElement('div');
      box.classList.add('weekly-box');
      box.innerHTML = `
        <strong>${day.day}</strong><br>
        <img src="http://openweathermap.org/img/wn/${day.icon}@2x.png" width="40" /><br>
        ${day.temp}<br><small>${day.desc}</small>
      `;
      weeklyContainer.appendChild(box);
    });

    document.getElementById('forecastWrapper').classList.remove('hidden');

  } catch (err) {
    alert("Error fetching weather. Check server or city name.");
    console.error(err);
  }
}

// ✅ Enter key support
document.getElementById('cityInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    getWeather();
  }
});

let isLoginMode = false;

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById("authTitle").innerText = isLoginMode ? "Login" : "Register";
  document.getElementById("authUsername").style.display = isLoginMode ? "none" : "block";
}

async function handleAuth() {
  const username = document.getElementById("authUsername").value;
  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;

  const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
  const body = isLoginMode ? { email, password } : { username, email, password };

  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(data.message || "Success");

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      showProfile(data.user);
      document.getElementById("authBox").classList.add("hidden");
    }

  } catch (err) {
    alert("Error: " + err.message);
  }
}

function showLogin() {
  isLoginMode = true;
  document.getElementById("authBox").classList.remove("hidden");
  document.getElementById("authTitle").innerText = "Login";
  document.getElementById("authUsername").style.display = "none";
}

function showRegister() {
  isLoginMode = false;
  document.getElementById("authBox").classList.remove("hidden");
  document.getElementById("authTitle").innerText = "Register";
  document.getElementById("authUsername").style.display = "block";
}

function logout() {
  localStorage.removeItem("user");
  location.reload();
}

function showProfile(user) {
  document.getElementById("loginBtn").classList.add("hidden");
  document.getElementById("registerBtn").classList.add("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
  document.getElementById("welcomeUser").innerText = "👤 " + user.username;
  document.getElementById("welcomeUser").classList.remove("hidden");
}

window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    showProfile(JSON.parse(savedUser));
  }
});
