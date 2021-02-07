exports.get404 = (req, res, next) => {
    let isLoggedIn = false;

    if (req.session.isLoggedIn) {
        isLoggedIn = req.session.isLoggedIn;
    };
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404', isAuthenticated: isLoggedIn, });
};