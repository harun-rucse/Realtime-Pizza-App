const path = require('path');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();

// Set Template engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/cart', (req, res) => {
  res.render('customers/cart');
});

// Server create
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
