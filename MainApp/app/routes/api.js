var Admin = require('../models/user');

module.exports = function (router) {
    //http://localhost:8080/api/admin
    router.post('/admin', function (req, res) {
        var admin = new Admin();
        admin.username = req.body.username;
        admin.password = req.body.password;
        if (admin.username == null || admin.username == '' || admin.password == null || admin.password == '') {
            res.send({success: false, message: 'Username or password were empty'});
        } else {
            admin.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: "Username already exists"});
                } else {
                    res.send({success: true, message: "Admin saved"});
                }
            });
        }
    });

    router.get('/home', function (req, res) {
        res.send("Hello from home!");
    });
    return router;
}