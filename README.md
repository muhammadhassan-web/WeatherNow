# WeatherNow

Full-stack weather application with real-time forecasts and user authentication.

## Features

- Real-time weather data via a third-party weather API
- User authentication (sign up / login) with bcrypt password hashing
- MongoDB-backed user accounts and search history
- Responsive vanilla JS frontend

## Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** bcrypt

## Project structure

```
WeatherNow/
|-- client/       (HTML/CSS/JS frontend)
|-- server/       (Express route/model source)
|-- package.json  (Server dependencies)
```

## Local development

```bash
npm install
node index.js
```

Then open client/index.html in your browser.
