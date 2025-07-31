const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load API key from environment
const API_KEY = process.env.WEATHER_API_KEY;

console.log("🔑 Forecast route using API key:", API_KEY);

router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ message: 'City is required' });

  try {
    // Step 1: Get coordinates using geocoding API
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    const geoRes = await axios.get(geoURL);

    console.log("Geocoding result:", geoRes.data);

    let lat, lon;

    if (!geoRes.data || geoRes.data.length === 0) {
      // Manual fallback for special case cities
      if (city.toLowerCase().includes('hunza')) {
        lat = 36.3167;
        lon = 74.65;
      } else if (city.toLowerCase().includes('fairy')) {
        lat = 35.3586;
        lon = 74.5662;
      } else {
        return res.status(404).json({ message: 'City not found via geocoding or fallback.' });
      }
    } else {
      lat = geoRes.data[0].lat;
      lon = geoRes.data[0].lon;
    }

    // Step 2: Use One Call API v2.5 (NOT v3)
    const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`;
    const forecastRes = await axios.get(forecastURL);

    console.log("Forecast API response:", forecastRes.data);

    const { hourly, daily } = forecastRes.data;

    if (!hourly || !daily) {
      return res.status(500).json({ message: 'Incomplete forecast data returned from API.' });
    }

    res.status(200).json({
      hourly: hourly.slice(0, 8), // next 8 hours
      daily: daily.slice(0, 7)    // next 7 days
    });

  } catch (error) {
    console.error("❌ Forecast API Error:", error.message);
    res.status(500).json({
      message: 'Error fetching forecast data',
      error: error.message,
      help: 'Check if your API key is valid and the city name is correct.'
    });
  }
});

module.exports = router;
