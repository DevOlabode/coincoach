const User = require('../models/user');

module.exports.registerForm =  (req, res) => {
    res.render('auth/register');
};

module.exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    const user = new User({ username, email });
    await User.register(user, password);

    req.flash('success', 'Registration successful! You can now log in.');
    res.redirect('/');
};

module.exports.loginForm = (req, res) => {
    res.render('auth/login');
};

module.exports.login = (req, res) =>{
    req.flash('success', 'Welcome back To CoinCoach!');
    const redirectUrl = res.locals.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};