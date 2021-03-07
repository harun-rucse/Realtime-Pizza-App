const path = require('path');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const webRouter = require('./routes/web');
const app = express();

// Set Template engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));

// Serve static files
app.use(express.static('public'));

// Web Routes
app.use('/', webRouter);

// Server create
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
