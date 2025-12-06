const sessionConfig = {
    secret : process.env.SECRET || 'fallBackSecret',
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : false, 
        httpOnly: true,
        expires : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

module.exports = {sessionConfig}