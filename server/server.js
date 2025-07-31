require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const path = require('path');

// Serve the client folder
app.use(express.static(path.join(__dirname, 'client')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);

const forecastRoutes = require('./routes/forecastRoutes');
app.use('/api/forecast', forecastRoutes);



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB Error:', err));
