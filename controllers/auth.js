const User = require('../models/user');

module.exports.home = (req, res)=>{
    res.render('home');
}

module.exports.registerForm = (req, res) => {
    res.render('auth/register');
};

module.exports.register = async (req, res, next) => {
    const { displayName, preferredCurrency, password, email } = req.body;

    const user = new User({ email, displayName, preferredCurrency });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to EduVision AI');
        res.redirect('/user/complete-profile');
    });
};

module.exports.loginForm = (req, res) => {
    res.render('auth/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back to CoinCoach!');
    const returnUrl = res.locals.returnTo || '/';
    res.redirect(returnUrl);
};

module.exports.logout = async(req, res)=>{
    req.logout(err=>{
        if(err) return next(err);
        req.flash('success', "Successfully Signed Out");
        res.redirect('/')
    })
};