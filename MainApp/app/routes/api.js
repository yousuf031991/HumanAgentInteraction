var Admin       = require('../models/user');
var TrialInfo   = require('../models/trialinfo');

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


    //http://localhost:8080/api/trialinfo
    router.post('/trialinfo', function (req, res) {
        var trialinfo = new TrialInfo();
        trialinfo.username = req.body.username;
        trialinfo.trialid = req.body.trialid;
        trialinfo.condition = req.body.condition;
        
        if (trialinfo.username == null || trialinfo.username == '' || trialinfo.trialid == null || trialinfo.trialid == '' || trialinfo.condition == null ||trialinfo.condition == '') {
            res.send({success: false, message: 'Username or trialid or condition was empty' + trialinfo.username + ' ID:' +trialinfo.trialid + 'CON:' + trialinfo.condition});
        } else {
            trialinfo.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: "Username already exists"});
                } else {
                    res.send({success: true, message: "Trial Information saved"});
                }
            });
        }
    });

    router.get('/home', function (req, res) {
        res.send("Hello from home!");
    });
    return router;
}
