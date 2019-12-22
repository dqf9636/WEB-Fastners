//load the dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

//load the config
const config = require('./config');
const port = process.env.PORT || 3000;

var app = express();

// CORS 설정
app.use(cors());

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//print the request log on console
app.use(morgan('dev'));

//set the secret key variable for JWT
app.set('jwt-secret', config.secret);

//index page TESTING 
app.get('/', (req, res) => {
  res.send('Hello JWT')
})

//configure api router
app.use('/api', require('./routes/api'))

//mongoDB 연동
mongoose.connect(config.mongodbUri);
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error);
db.once('open', function() {
    console.log('Connected to mongodb server');
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
