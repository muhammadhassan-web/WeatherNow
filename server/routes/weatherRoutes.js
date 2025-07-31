const express = require('express');
const axios = require('axios');
const router = express.Router();

const Search = require('../models/Search'); // ? Import Search model
const API_KEY = process.env.WEATHER_API_KEY;

// GET /api/weather?city=CityName
router.get('/', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  try {
    // ? Fetch weather first
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = response.data;
    const temp = data.main.temp;

    // ? Save searched city in MongoDB
    await Search.create({ city: data.name });

    // Clothing suggestion
    let suggestion = '';
    if (temp >= 30) {
      suggestion = "It's very hot. Wear light clothes like t-shirts and shorts.";

    } else if (temp >= 20) {
      suggestion = "Nice weather. A light jacket or long sleeves will be comfortable.";
    } else if (temp >= 10) {
      suggestion = suggestion = "It's cool. Wear a jacket or sweater.";
    } else {
      suggestion = "It's cold. Bundle up with a warm coat and layers.";
    }

    // Response
    const weather = {
      city: data.name,
      country: data.sys.country,
      temperature: temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      suggestion: suggestion
    };

    res.status(200).json(weather);
  } catch (error) {
    console.error("? Weather API error:", error.message);
    res.status(500).json({
      message: 'Error fetching weather data',
      error: error.message
    });
  }
});

module.exports = router;
