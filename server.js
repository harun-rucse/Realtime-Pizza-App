const path = require('path');
const EventEmitter = require('events');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const MongoDbStore = require('connect-mongo')(session);
const webRouter = require('./routes/web');

const app = express();
dotenv.config();

// Set Template engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/resources/views'));

// Serve static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Event emitter
const eventEmitter = new EventEmitter();
app.set('eventEmitter', eventEmitter);

// Session store
const mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: 'sessions'
});

// Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// Passport config
require('./app/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;

  next();
});

// Web Routes
app.use('/', webRouter);
app.all('*', (req, res) => {
  res.render('notFound');
});

// Server create
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// Socket.io connection
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('join', (roomName) => {
    socket.join(roomName);
  });
});

eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data);
});
