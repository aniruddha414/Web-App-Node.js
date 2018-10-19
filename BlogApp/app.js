console.log("app.js is running");

// require packages
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session =  require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/webapp',{useNewUrlParser:true}); // connecting to db
var db = mongoose.connection; // obj of db

var routes = require('./routes/index');
var users = require('./routes/users');

// Initialise app
var app = express();

// View Engine

app.set('views',path.join(__dirname,'views')); // a folder called views to handle our views
app.engine('handlebars',expressHandlebars({defaultLayout:'layout'}));
app.set('view engine','handlebars'); // set view engine to handle bars

// Body parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// Set static folder

app.use(express.static(path.join(__dirname,'public'))); // folder where we will put style sheets,images,jQuyery etc stuff publicly accessible to browser

// Express session

app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
})); // explorse session

// Passport Init
app.use(passport.initialize());
app.use(passport.session());
//Express Validator
app.use(expressValidator({
    errorFormatter: function (param,msg,value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
        while (namespace.length) 
        {
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

// Connect flash middleware

app.use(flash());

// global variables

app.use(function (req,res,next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// add submit away for route files

app.use('/',routes);
app.use('/users',users);

// set port

app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'),function () {
    console.log('Server started on port '+app.get('port'));
    
});