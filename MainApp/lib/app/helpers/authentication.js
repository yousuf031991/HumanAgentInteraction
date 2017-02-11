import Admin from '../models/user';

const configs = JSON.parse(process.env.CONFIGS);

function authenticate(req, res, next) {
    if(isAdminRoute(req)) {
        if(isLoginRoute(req)) {
            if(hasSignedIn(req)) {
                res.redirect("/admin/");
            } else {
                next();
            }
        } else if(hasSignedIn(req)) {
            const email = req.session.user.email;
            serializeUser(email, req, res, function () {
                next();
            });
        } else {
            res.redirect("/admin/login");
        }
    } else {
        next();
    }
}

function serializeUser(email, req, res, callback) {
    Admin.findOne({ username: email }, function(err, user) {
        if (user) {
            // TODO - give away user id, name and role only
            req.user = user;
            req.session.user = user;  //refresh the session value
            res.locals.user = user;
        }
        callback(err, user);
    });
}

function deserializeUser(id) {

}

function isLoginRoute(req) {
    return req.url.startsWith("/admin/login");
}

function isAdminRoute(req) {
    return req.url.startsWith("/admin");
}

function hasSignedIn(req) {
    return req.session && req.session.user;
}

export default {
    authenticate: authenticate,
    serializeUser: serializeUser
}