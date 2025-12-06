require('dotenv').config();

const express = require('express');
const app = express();

const path = require('path');

const ejsMate = require('ejs-mate');

const session = require('express-session');
const flash = require('connect-flash');

const {sessionConfig} = require('./config/session');

app.use(session(sessionConfig));
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);

require('./config/db')();

app.use((req, res, next)=>{
    // res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.warning = req.flash('warning')
    next();
});

app.get('/', (req, res) => {
    req.flash('success', 'Welcome to the Home Page!');
    res.render('home');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{ 
    console.log(`Server is running on port ${PORT}`);
});