const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const indexRouter = require("./routes");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const serviceRouter = require("./routes/service");
const createError = require("http-errors");
const rendez_vousRouter = require('./routes/rendez_vous');

class AppInitializer {
    constructor(app) {
        this.app = app;
    }

    init() {
        this.initViewEngine()
        this.initConfig()
        this.initRouter()
        this.initFallback()
    }

    initViewEngine() {
        // view engine setup
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'jade');
    }

    initRouter() {
        console.log("init router")
        this.app.use('/', indexRouter);
        this.app.use('/', authRouter);
        this.app.use('/users', usersRouter);
        this.app.use('/services', serviceRouter);
        this.app.use('/rdvs', rendez_vousRouter);
    };

    initConfig() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(cors());
    };

    initFallback() {
        // catch 404 and forward to error handler
        this.app.use(function (req, res, next) {
            next(createError(404));
        });

        // error handler
        this.app.use(function (err, req, res) {
            // set locals, only providing error in development
            res.locals = {
                message: err.message,
                error: req.app.get('env') === 'development' ? err : {}
            };

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    };
}

module.exports = {AppInitializer}