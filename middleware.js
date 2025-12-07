const passport = require('passport');


module.exports.loginAuthenticate = passport.authenticate('local', {
    failureFlash : true,
    failureRedirect : '/login'
});

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.body.returnTo) {
        res.locals.returnTo = req.body.returnTo;
    } 
    else if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }

    else if (req.get('referer')) {
        res.locals.returnTo = req.get('referer');
    }
    next();
};

module.exports.redirectIfLoggedIn = (req, res, next)=>{
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();

}