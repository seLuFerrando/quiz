var express = require('express');
var path = require('path');
var partials = require('express-partials')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({}));
app.use(cookieParser('Quiz-2015'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
//app.use(session({cookie:{maxAge:120000}}));
app.use(session());
// Auto Logout after 2 min. (120000ms) of inactivity
app.use(function(req, res, next) {
  if(req.session.user){
    if((new Date()).getTime() > (req.session.timeOut + 120000)){
      delete req.session.user;
      delete req.session.timeOut;
//      console.log(" - - SESSION TIMEOUT - - ");
    }else{
      req.session.timeOut = (new Date()).getTime();
//      console.log(" - - SESSION TIME UPDATED - - ");
    }
  }
  next();
}); 

// Helpers dinamicos:
app.use(function(req, res, next) {
  // save path in session.redir for redirect after login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Make visible req.session
  res.locals.session = req.session;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
