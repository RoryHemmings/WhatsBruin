const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const db = require('./queries');
const app = express();

// Routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const eventRouter = require('./routes/event');
const homeRouter = require('./routes/home');
const searchRouter = require('./routes/search');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/* GET home page. */
app.get('/', (req, res, next) => {
  res.json({'code': 200});
});

app.use('/home', homeRouter);
app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use('/auth', authRouter);
app.use('/search', searchRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  const error = req.app.get('env') === 'development' ? err : {}

  // send error info in json
  res.status(err.status || 500).json(error);
});

module.exports = app;

