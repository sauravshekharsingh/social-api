const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose
  .connect(MONGO_URI, options)
  .then(() => console.log('Connected to the database.'))
  .catch((err) => console.log('Error connecting to the database', err));

const db = mongoose.connection;

module.exports = db;
