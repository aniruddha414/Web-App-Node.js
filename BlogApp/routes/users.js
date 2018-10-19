console.log("users.js");

var express  = require('express');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Register

router.get('/register',function (req,res) {
    res.render('register');
});

// Login

router.get('/login',function (req,res) {
    res.render('login');
});

// Register User

router.post('/register',function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    //Validation
    req.checkBody('name','Name is required !').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Enter valid email').isEmail();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('confirmPassword','Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();

    if (errors) {
        console.log('Errors are present');
        res.render('register',{errors:errors});
        console.log('Password : '+password);
        console.log('Confirm Password : '+confirmPassword);
        
    } else {
        console.log('Passed');
        // create new user
        var newUser =  new User({
            name : name,
            email : email,
            password : password
        });

        User.createUser(newUser, function (err,user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg','You are registered Successfully !');

        res.redirect('/users/login');
    }
    console.log("Name : "+name);
});
// Authenticate user
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByEmail(username, function (err,user) {
            if(err) throw err;
            if(!user){
                return done(null,false,{message : 'User Not Registered'});
            }

            // verify password
            User.verifyPassword(password, user.password,function (err,isMatch) {
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message:'Incorrect Password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
        });
    });

router.post('/login',
    passport.authenticate('local',{successRedirect : '/',failureRedirect : '/users/login',failureFlash : true}),
    function(req, res) {
    // if this function is called authentication is successfull
    console.log('recieved');
    
        res.redirect('/');
    });

// Ensures authentication
function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    } else{
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

router.get('/quiz',ensureAuthenticated,function (req,res) {
    res.render('quiz');
});
router.get('/logout', function (req,res) {
    req.logout();

    req.flash('success_msg','Logged out Successfully');

    res.redirect('/users/login');
});

module.exports = router;