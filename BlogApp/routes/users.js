console.log("users.js");

var express  = require('express');
var router = express.Router();

// Register

router.get('/register',function (req,res) {
    res.render('register');
    console.log("Rendering register");
    
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
    }
    console.log("Name : "+name);
});

router.post('/login',function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    console.log("Email : "+email);

    // validation
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Enter valid email').isEmail();
    
    res.render('index');
});

module.exports = router;
