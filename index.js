const path = require('path');
const cors = require('cors')


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = "mongodb+srv://GoldCode:aTZGS2Gu0VQJU27G@cluster0.qz6md.mongodb.net/shop"

const errorController = require('./controllers/error');
const User = require('./models/user')

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    let isLoggedIn = false;
    if (req.session.isLoggedIn) {
        isLoggedIn = req.session.isLoggedIn;
    };

    res.locals.isAuthenticated = isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(flash());

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(locationRoutes);

app.use(errorController.get404);


const corsOptions = {
    origin: "https://cse41-webapp.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || MONGODB_URI;

mongoose
    .connect(
        MONGODB_URL, options
    )
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });