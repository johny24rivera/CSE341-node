exports.getLocation = (req, res, next) => {

    let isLoggedIn = false;

    if (req.session.isLoggedIn) {
        isLoggedIn = req.session.isLoggedIn;
    };
    res.render('shop/location', {
        pageTitle: 'Location and hours',
        path: '/location',
        isAuthenticated: isLoggedIn,
    });
};