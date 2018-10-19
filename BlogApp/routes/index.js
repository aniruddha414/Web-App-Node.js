console.log('index.js');
var express  = require('express');
var router = express.Router();

// Get Homepage / for home page

router.get('/',function (req,res) {
    res.render('index');
});

// Ensures authentication
/*function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    } else{
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}*/

module.exports = router;

