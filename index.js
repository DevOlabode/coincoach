require('dotenv').config();

const express = require('express');
const app = express();

const path = require('path');

const ejsMate = require('ejs-mate');

const methodOverride = require('method-override');

const session = require('express-session');
const flash = require('connect-flash');


const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const ExpressError = require('./utils/ExpressError');

const {sessionConfig} = require('./config/session');

app.use(session(sessionConfig));
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

require('./config/db')();

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    { 
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            
            // Use passport-local-mongoose's authenticate method
            const result = await user.authenticate(password);
            if (result.user) {
                return done(null, result.user);
            } else {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages middleware
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.warning = req.flash('warning');
    next();
});


// Routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const chatSessionRoutes = require('./routes/chatSession');
const chatMessageRoutes = require('./routes/chatMessage');
const chatAIRoutes = require('./routes/chatAI');
const userRoutes = require('./routes/user');
const recieptRoutes = require('./routes/reciept');
const insightsRoutes = require('./routes/insights');
const exportRoutes = require('./routes/export');
const billRoutes = require('./routes/bill');

// Add after existing route uses
app.use('/chat', chatSessionRoutes);
app.use('/chat/sessions', chatMessageRoutes);
app.use('/api/ai', chatAIRoutes);
app.use('/reciept', recieptRoutes);
app.use('/', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/user', userRoutes);
app.use('/insights', insightsRoutes);
app.use('/export', exportRoutes);
app.use('/', billRoutes);

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message){
        err.message = 'Something Went Wrong!'
    }
    res.status(statusCode).render('error', {err})
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{ 
    console.log(`Server is running on port ${PORT}`);
});