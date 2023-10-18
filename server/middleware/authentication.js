

exports.isAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        console.log('User is not authenticated');
        //TODO: Redirect to login page
};
