const passport = require('passport');
const ExpressError = require('./utils/ExpressError');
const {transactionSchema, userSchema} = require('./schema');

module.exports.validateTransaction = (req, res, next) => {
    const { error } = transactionSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    }else{
        next();
    }
};

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    }else{
        next();
    }
};

module.exports.loginAuthenticate = passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    successFlash: false 
});

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login')
    }
    next()
};

module.exports.storeReturnTo = (req, res, next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next();
};

module.exports.redirectIfLoggedIn = (req, res, next)=>{
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
};

module.exports.redirectIfCompletedProfile = (req, res, next)=>{
    if (req.user && req.user.displayName && req.user.location && req.user.bio) {
        return res.redirect('/');
    }
    next();
};