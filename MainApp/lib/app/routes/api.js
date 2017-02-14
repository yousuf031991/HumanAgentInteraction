import Admin from '../models/user';
import TrialInfo from '../models/trialinfo';
import GameConfig from '../models/gameConfig';
import Game from '../models/game';
import UserStatistics from '../models/UserStatistics';
import Authenticator from '../helpers/authentication';


export default function (router) {
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

        gameConfig.save(function (error) {
            if (error) {
                console.log(error);
                res.send({success: false, message: error.errors});
            } else {
                res.send({success: true, message: "Game config saved"});
            }
        });

    });

    //http://localhost:8080/api/gameinfo
    router.post('/gameinfo', function (req, res) {
        let gameinfo = new Game();
        gameinfo.gameConfigId = req.body.gameConfigId;
        gameinfo.trialInfoId = req.body.trialInfoId;
        gameinfo.userStatsId = req.body.userStatsId;
        gameinfo.username = req.body.username;

        if (gameinfo.gameConfigId == null || gameinfo.gameConfigId == '' || gameinfo.trialInfoId == null || gameinfo.trialInfoId == '' || gameinfo.userStatsId == null || gameinfo.userStatsId == '') {
            res.send({success: false, message: 'gameConfigId or trialInfoId or userStatsId was empty'});
        } else {
            gameinfo.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: "Error inserting into collection"});
                } else {

                    res.send({success: true, message: "Game Information Saved"});
                }
            });
        }
    });

    //http://localhost:8080/api/gameinfo
    router.post('/gameinfo', function (req, res) {
        let gameinfo = new Game();
        gameinfo.gameConfigId = req.body.gameConfigId;
        gameinfo.trialInfoId = req.body.trialInfoId;
        gameinfo.userStatsId = req.body.userStatsId;
        gameinfo.username = req.body.username;
        
        if (gameinfo.gameConfigId == null || gameinfo.gameConfigId == '' || gameinfo.trialInfoId == null || gameinfo.trialInfoId == '' || gameinfo.userStatsId == null || gameinfo.userStatsId == '') {
            res.send({success: false, message: 'gameConfigId or trialInfoId or userStatsId was empty'});
        } else {
            gameinfo.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: "Error inserting into collection"});
                } else {

                    res.send({success: true, message: "Game Information Saved"});
                }
            });
        }
    });

    //http://localhost:8080/api/admin/login
    router.post("/admin/login",function(req,res) {
        Admin.count({ username: req.body.username}, function(err,count) {
            if(count>0) {
                res.send({success: true, message: "The username you entered is a valid admin username. Please continue with Gmail sign in."});
            } else {
                res.send({success: false, message: "Sorry! There is no admin user with the username you provided."});
            }
        });
    });

    //http://localhost:8080/api/admin/logout
    router.post('/admin/logout', function(req, res) {
        req.session.reset();
        res.send({success: true, redirectTo: '/admin/login'});
    });

    router.post("/newAdmin", function (req, res) {
        let admin = new Admin();
        admin.username = req.body.username;
        admin.role = "ADMIN";
        if (!admin.username) {
            res.send({success: false, message: 'User name was empty'});
        } else {
            admin.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: "User name already exists"});
                } else {
                    res.send({success: true, message: "Admin saved"});
                }
            });
        }
    });

    router.post('/userStatistics', function(req, res) {

        let userStatistics = new UserStatistics();
        userStatistics.username = req.body.username;
        userStatistics.finalScore = req.body.finalScore;

        userStatistics.save(function (err) {
            
            //console.log("Printing userStatistics")
            //console.log(userStatistics)
            if (err) {
                    console.log(err);
                    res.send({success: false, message: "Userstatiscts row not created"});
                } else {
                    res.send({success: true, message: "Userstatiscts row created"});
                }

        });
    });

    router.get("/viewAdmin", function (req, res) {
        Admin.find({}, function (error, docs) {
            if (error) {
                console.log(error);
                res.send({success: false, message: "Error"});
            } else {
                res.send({success: true, message: "Found users", data: docs});
            }
        });
    });

    router.post("/deleteAdmin", function (req, res) {
        Admin.remove({username: req.body.username}, function (error) {
            if (error) {
                console.log(error);
                res.send({success: false, message: "User Name doesn't exist"});
            } else {
                res.send({success: true, message: "Admin deleted"});
            }
        });
    });

    router.post("/admin/signInUser", function (req, res) {
        Authenticator.serializeUser(req.body.username, req, res, function (err, user) {
            if(err) {
                console.log(err);
                res.send({success: false, error: err});
            } else {
                if(req.body.fullname) {
                    user.fullname = req.body.fullname;
                    user.save(function (error) {
                        if (error) {
                            console.log(error);
                            res.send({success: false, error: error});
                        } else {
                            res.send({success: true, redirectTo: '/admin'});
                        }
                    });
                } else {
                    res.send({success: true, redirectTo: '/admin'});
                }
            }
        });
    });


    router.get('/home', function (req, res) {
        res.send("Hello from home!");
    });
    return router;
};
