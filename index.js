const express = require('express');
const app = express();
const dotenv = require('dotenv');
const passport = require('passport');
const db = require('./config/mongoose');
const cors = require('cors');
app.use(cors());

// dotenv
dotenv.config();

// Passport
require('./config/passport');
app.use(passport.initialize());

// Body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes'));

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
