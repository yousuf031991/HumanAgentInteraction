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
        } else if(!hasSignedIn(req)) {
            res.redirect("/admin/login?redirect=true");
        }
    }

    if(hasSignedIn(req)) {
        const username = req.session.user.username;
        serializeUser(username, req, res, function (err, user) {
            if(isSuperAdminOnlyRoute(req) && user && user.role !== "SUPER ADMIN") {
                res.redirect("/admin?reason=not_super");
            } else {
                next();
            }
        });
    } else {
        next();
    }
}

function serializeUser(email, req, res, callback) {
    Admin.findOne({ username: email }, function(err, user) {
        if (user) {
            // TODO - don't send unnecessary info to the insecure client side
            // TODO - encrypt
            req.user = user;
            delete req.user.password;
            req.session.user = user;  //refresh the session value
            res.locals.user = user;
        }
        callback(err, user);
    });
}

function isLoginRoute(req) {
    return req.url.startsWith("/admin/login");
}

function isSuperAdminOnlyRoute(req) {
    return req.url.startsWith("/admin/manage");
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