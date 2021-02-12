const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Email was not found');
                res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    } else {
                        req.flash('error', 'Password was Incorrect');
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
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const check = req.body.confirmPassword;

    if (password !== check) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/signup');
    };

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'User already exists');
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
                    transporter.sendMail({
                        to: email,
                        from: 'jonathan24rivera@gmail.com',
                        subject: 'Signup Succeeded',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                    return res.redirect('/login');
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

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
    });
}