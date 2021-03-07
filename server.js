const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expressLayout = require('express-ejs-layouts');
const webRouter = require('./routes/web');

const app = express();
dotenv.config();

// Set Template engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));

// Serve static files
app.use(express.static('public'));

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});

const connection = mongoose.connection;
connection
  .once('open', () => {
    console.log('DB connect successful!');
  })
  .catch((err) => {
    console.log('DB connect fail!');
  });

// Web Routes
app.use('/', webRouter);

// Server create
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
