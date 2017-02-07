import Admin from '../models/user';
import TrialInfo from '../models/trialinfo';
import GameConfig from '../models/gameConfig';
import ManageAdmin from '../models/admin';

export default function (router) {
    //http://localhost:8080/api/admin
    router.post('/admin', function (req, res) {
        let admin = new Admin();
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
        let trialinfo = new TrialInfo();
        trialinfo.username = req.body.username;
        trialinfo.trialid = req.body.trialid;
        trialinfo.condition = req.body.condition;

        if (trialinfo.username == null || trialinfo.username == '' || trialinfo.trialid == null || trialinfo.trialid == '' || trialinfo.condition == null || trialinfo.condition == '') {
            res.send({
                success: false,
                message: 'Username or trialid or condition was empty' + trialinfo.username + ' ID:' + trialinfo.trialid + 'CON:' + trialinfo.condition
            });
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

    //http://localhost:8080/api/gameConfig
    router.post('/gameConfig', function (req, res) {
        let gameConfig = new GameConfig();

        gameConfig.cooperation = req.body.cooperation;
        gameConfig.mode = req.body.mode;
        gameConfig.earlyType = req.body.earlyType;
        gameConfig.startNumPatientAs = req.body.startNumPatientAs;
        gameConfig.startNumPatientBs = req.body.startNumPatientBs;
        gameConfig.numOfDoctors = req.body.numOfDoctors;
        gameConfig.numOfNurses = req.body.numOfNurses;
        gameConfig.numOfSurgeons = req.body.numOfSurgeons;
        gameConfig.totalTimeInSeconds = req.body.totalTimeInSeconds;
        // Neighbouring Hospital
        gameConfig.NHstartNumPatientAs = req.body.NHstartNumPatientAs;
        gameConfig.NHstartNumPatientBs = req.body.NHstartNumPatientBs;
        gameConfig.NHnumOfDoctors = req.body.NHnumOfDoctors;
        gameConfig.NHnumOfNurses = req.body.NHnumOfNurses;
        gameConfig.NHnumOfSurgeons = req.body.NHnumOfSurgeons;
        gameConfig.patientHelpTimeInSeconds = req.body.patientHelpTimeInSeconds;
        if (gameConfig.cooperation == null || gameConfig.cooperation === '' ||
            gameConfig.mode == null || gameConfig.mode === '' ||
            gameConfig.earlyType == null || gameConfig.earlyType === '' ||
            gameConfig.startNumPatientAs == null || gameConfig.startNumPatientAs === '' ||
            gameConfig.startNumPatientBs == null || gameConfig.startNumPatientBs === '' ||
            gameConfig.numOfDoctors == null || gameConfig.numOfDoctors === '' ||
            gameConfig.numOfNurses == null || gameConfig.numOfNurses === '' ||
            gameConfig.numOfSurgeons == null || gameConfig.numOfSurgeons === '' ||
            gameConfig.totalTimeInSeconds == null || gameConfig.totalTimeInSeconds === '' ||
            gameConfig.NHstartNumPatientAs == null || gameConfig.NHstartNumPatientAs === '' ||
            gameConfig.NHstartNumPatientBs == null || gameConfig.NHstartNumPatientBs === '' ||
            gameConfig.NHnumOfDoctors == null || gameConfig.NHnumOfDoctors === '' ||
            gameConfig.NHnumOfNurses == null || gameConfig.NHnumOfNurses === '' ||
            gameConfig.NHnumOfSurgeons == null || gameConfig.NHnumOfSurgeons === '' ||
            gameConfig.patientHelpTimeInSeconds == null || gameConfig.patientHelpTimeInSeconds === '') {
            res.send({success: false, message: 'One or more fields were empty'});
        }
        else {
            gameConfig.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: error.errors});
                } else {
                    res.send({success: true, message: "Game config saved"});
                }
            });
        }
    });

    //http://localhost:8080/api/adminLogin
    router.post("/adminLogin", function (req, res) {
        Admin.count({username: req.body.email}, function (err, count) {
            if (count > 0) {
                res.send(true);
            } else {
                res.send(false);
            }
        });
    });

    router.post("/newAdmin", function (req, res) {
        let manageAdmin = new ManageAdmin();
        manageAdmin.emailId = req.body.emailId;
        manageAdmin.role = "ADMIN";
        if (!manageAdmin.emailId) {
            res.send({success: false, message: 'Email was empty'});
        } else {
            manageAdmin.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: "Email Id already exists"});
                } else {
                    res.send({success: true, message: "Admin saved"});
                }
            });
        }
    });

    router.get("/viewAdmin", function (req, res) {
        ManageAdmin.find({}, function (error, docs) {
            if (error) {
                console.log(error);
                res.send({success: false, message: "Error"});
            } else {
                res.send({success: true, message: "Found users", data: docs});
            }
        });
    });

    router.post("/deleteAdmin", function (req, res) {
        ManageAdmin.remove({emailId: req.body.emailId}, function(error){
            if (error) {
                console.log(error);
                res.send({success: false, message: "Email Id doesn't exist"});
            } else {
                res.send({success: true, message: "Admin deleted"});
            }
        });
    });

    router.get('/home', function (req, res) {
        res.send("Hello from home!");
    });
    return router;
};
