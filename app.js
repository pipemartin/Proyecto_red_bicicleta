var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const passport = require('./config/passport');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter    = require('./routes/token');
var bicicletasRouter = require('./routes/bicicletas');
var bicicletaAPIRouter = require('./routes/api/bicicletas');
var usuarioAPIRouter = require('./routes/api/usuarios');

const store = new session.MemoryStore;
var app = express();
app.use(session({
  cookie: { maxAge: 240*60*60*1000},
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicis!!!'
}))


var mongoDB = 'mongodb://localhost/red_bicicletas';
mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'Mongo DB connection error: '));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(passport.initialize());
//app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login',function(req, res){
  res.render('session/login');
});

app.post('/login',function(req, res, next){
  passport.authenticate('local',function(err, usuario, info){
    if(err) return next(err);
    if(!usuario) return res.render('session/login',{info});
    req.logIn(usuario, function(err){
      if(err)return next(err);
      return res.redirect('/');
    });
  })(req,res,next);
});

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

app.get('/forgotPassword', function(req,res){

});

app.post('/forgotPassword', function(req,res){
  
});


app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token',tokenRouter);
app.use('/bicicletas', loggedId, bicicletasRouter);
app.use('/api/bicicletas',validarUsuario, bicicletaAPIRouter);
app.use('/api/usuarios',usuarioAPIRouter);

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

function loggedId(req,res,next){
  if(req.user){
    next();
  } else{
    console.log('user sin logearse');
    res.redirect('/login');
  }
};

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {

      req.body.userId = decoded.id;

      console.log('jwt verify: ' + decoded);

      next();
    }
  });
}

module.exports = app;
