import Admin from '../models/user';

const configs = JSON.parse(process.env.CONFIGS);

const adminApiURLs=['/api/gameConfig','/api/gameinfo','/api/newAdmin','/api/viewAdmin','/api/deleteAdmin', 
                    '/api/admin/signOutUser','/api/deleteConf','/api/updateConf','/api/deactivateConf','/api/exportLogs','/api/listExports'];

const superAdminApiURLs=['/api/newAdmin','/api/viewAdmin','/api/deleteAdmin'];

function authenticate(req, res, next) {
    if(isApiURL(req) && !isBrowserRequest(req)){
        return res.send("Sorry your request could not be processed");
    }


    if(isAdminRoute(req)) {
        if(isLoginRoute(req)) {
            if(hasSignedIn(req)) {
                return res.redirect("/admin/");
            } else {
                next();
            }
        } else if(!hasSignedIn(req)) {
            return res.redirect("/admin/login?redirect=true");
        }
    }

    if(hasSignedIn(req)) {
        const username = req.session.user.username;
        serializeUser(username, req, res, function (err, user) {
            if(isSuperAdminOnlyRoute(req) && user && user.role !== "SUPER ADMIN") {
                return res.redirect("/admin?reason=not_super");
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
    return req.url.startsWith("/admin/manage") || superAdminApiURLs.indexOf(req.url)!=-1;
}

function isAdminRoute(req) {
    return req.url.startsWith("/admin") || adminApiURLs.indexOf(req.url)!=-1;
}

function hasSignedIn(req) {
    return req.session && req.session.user;
}

function isBrowserRequest(req){
    let scriptedRequest=req.get('Cookie')==undefined || req.get('User-Agent').startsWith('curl/');
    return !scriptedRequest;
}

function isApiURL(req){
    return req.url.startsWith('/api');
}

export default {
    authenticate: authenticate,
    serializeUser: serializeUser
}