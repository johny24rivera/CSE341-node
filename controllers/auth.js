const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let isLoggedIn = false;

    if (req.session.isLoggedIn) {
        isLoggedIn = req.session.isLoggedIn;
    };

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/login');
                        });
                    } else {
                        return res.redirect('/login');
                    };
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
    let isLoggedIn = false;

    if (req.session.isLoggedIn) {
        isLoggedIn = req.session.isLoggedIn;
    };

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: isLoggedIn,
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const check = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] },
                    });

                    return user.save();
                })
                .then(result => {
                    res.redirect('/');
                });
        })
        .catch(err => {
            console.log(err);
        });
};


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};