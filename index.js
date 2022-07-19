if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const path = require('path');
const port = process.env.PORT || 3000;
const ExpressError = require('./utils/ExpressError')

//Models
const User = require('./models/user')
//

// NPM Modules
const express = require('express');
const app = express();
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
//

// Routes Directory
const parcaosRoutes = require('./routes/parcaos');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
//

// Connecting to databse - Mongo + Mongoose
const MongoDBStore = require('connect-mongo')(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/parcao'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});
//

// Views - Configurations
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//

// Middlewares
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())
//

// Session
const secret = process.env.SECRET || 'tibia'

const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60 // seconds

})

store.on('error', function (err) {
    console.log('Session store error', err)
})

const sessionConfig = {
    store: store,
    name: 'maritin.tr', // changed cookie name to make it less obvious
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // use only when deployed
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // miliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7 // miliseconds
    }
}

app.use(session(sessionConfig))
//

// Passport Configuration (session must come before)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//

// Locals - Flash Messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.currentUser = req.user;
    next()
})
//

app.use(
    helmet.permittedCrossDomainPolicies({
        permittedPolicies: "none"
    })
);

// Express Routes
app.use('/parcaos', parcaosRoutes)
app.use('/parcaos/:id/reviews/', reviewsRoutes)
app.use('/', usersRoutes)
//

// Landing page
app.get('/', (req, res) => {
    res.render('home')
})
//

// Error handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'Algo deu errado';
    res.status(statusCode).render('error.ejs', {
        err
    });

})
//


app.listen(port, () => {
    console.log(`Express server working on port ${port}`)
});