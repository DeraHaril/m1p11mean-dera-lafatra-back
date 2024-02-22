var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serviceRouter = require('./routes/service');
var rendez_vousRouter = require('./routes/rendez_vous');

var app = express();

const uri = process.env.MONGODB_URI || 'mongodb://localhost27017/salon_beaute_mean';
MongoClient.connect(uri, { useUnifiedTopology: true
})
.then(client => {
  console.log('Connected to Database');

  const db = client.db('salon_beaute_mean');
  const userCollection = db.collection('user');
  const serviceCollection = db.collection('service');
  const render_vousCollection = db.collection('rendez_vous');

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter(userCollection));
    app.use('/service', serviceRouter(serviceCollection));
    app.use('/rendez_vous', rendez_vousRouter(render_vousCollection));

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
  })
  .catch(error => console.error(error))

module.exports = app;
