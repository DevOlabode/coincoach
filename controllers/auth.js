// const User = require('../models/user');

// module.exports.registerForm = (req, res) => {
//     res.render('auth/register');
// };

// module.exports.register = async (req, res) => {
//     const { username, password, email } = req.body;

//     const user = new User({ email });
//     const registeredUser = await User.register(user, password);

//     req.login(registeredUser, err =>{
//         if(err) return next(err);
//         req.flash('success', 'Welcome to EduVision AI');
//         res.redirect('/');
//     });
// };

// module.exports.loginForm = (req, res) => {
//     res.render('auth/login');
// };

// module.exports.login = async(req, res) =>{
//     req.flash('success', 'Welcome back to CoinCoach!');
//     const returnUrl = res.locals.returnTo || '/'
//     res.redirect(returnUrl)
// };

const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('auth/register');
};

module.exports.register = async (req, res, next) => {
    const { username, password, email } = req.body;

    const user = new User({ email });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to EduVision AI');
        res.redirect('/');
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

module.exports.enterEmail = (req, res) =>{
    res.render('auth/enterEmail');
};

module.exports.confirmEmail = async(req, res) =>{
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user){
        req.flash('error', 'No account with that email found.');
        return res.redirect('/forgotten-password');
    }

    res.redirect('/reset-password');
};

module.exports.resetCodeForm = (req, res) =>{
    res.render('auth/resetCode');
};