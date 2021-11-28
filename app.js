const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

// Set up .env file
require('dotenv').config();

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// CORS configuration
const corsOptions = {
  origin: "http://localhost:8000"
}

app.use(cors(corsOptions))

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require routes to the app
require('./server/routes')(app);
//require('./server/routes/auth.routes')(app);
//require('./server/routes/user.routes')(app);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning.',
}));

module.exports = app;