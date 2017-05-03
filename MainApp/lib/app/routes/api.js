import Admin from "../models/user";
import TrialInfo from "../models/trialinfo";
import GameConfig from "../models/gameConfig";
import Game from "../models/game";
import UserStatistics from "../models/userStatistics";
import Authenticator from "../helpers/authentication";
import WorkerQueue from "../background-jobs/worker-queue";
import AdminLog from "../models/adminLog";
import BackgroundJob from "../models/background-job";
import * as UUID from "uuid-1345";
const configs = JSON.parse(process.env.CONFIGS);


export default function (router) {
    //http://localhost:8080/api/trialinfo
    router.post('/trialinfo', function (req, res) {
        let trialinfo = new TrialInfo();

        let userIdV1 = UUID.v1();// Version 1 UUID- Created using MAC address of the server and timestamp
        let userIdV4 = UUID.v4();// Version 4 UUID- Created Using random number generator.
        trialinfo.username = userIdV1 + "-" + userIdV4;// The combination to prevent any collision between uuids created on different servers.

        GameConfig.find({active: true}, function (err, record) {
            if (record.length == 0) {
                res.send({success: false, message: "Sorry! The game is not available currently."});
                return;
            }

            let gameConfigId = record[0]._id;
            trialinfo.trialid = gameConfigId;

            // Dummy field. Could be used for something later or removed.
            trialinfo.condition = 'A';

            console.log(trialinfo.username);
            console.log("GAME CONFIG ID" + gameConfigId);

            if (trialinfo.username == null || trialinfo.username == '' || trialinfo.trialid == null || trialinfo.trialid == '') {
                res.send({
                    success: false,
                    message: 'Username or trialid or condition was empty' + trialinfo.username + ' ID:' + trialinfo.trialid
                });
            } else {
                trialinfo.save(function (error) {
                    if (error) {
                        console.log(error);
                        // TODO: Redirect to Thank you for already playing the game page.
                        res.send({success: false, message: "Username already exists"});
                    } else {
                        res.send({success: true, userid: trialinfo.username, message: "Trial Information saved"});
                    }
                });
            }
        });

    });

    //http://localhost:8080/api/gameConfig
    router.post('/gameConfig', function (req, res) {
        let gameConfig = new GameConfig();

        gameConfig.author = req.user.username;
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

        gameConfig.save(function (error, config) {
            if (error) {
                console.log(error);
                res.send({success: false, message: error.errors});
            } else {
                res.send({success: true, message: "Game config saved", configId: config.id});
            }
        });

    });

    router.get("/getGameConfig", function (req, res) {
        GameConfig.find({active: true}, function (error, record) {
            if (error) {
                console.log(error);
                res.send({success: false, message: "Error"});
            } else {
                console.log("Getting record")
                res.send({success: true, message: "Success", config: record[0]});
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


    //http://localhost:8080/api/admin/login
    router.post("/admin/login", function (req, res) {
        Admin.count({username: req.body.username}, function (err, count) {
            if (count > 0) {
                res.send({
                    success: true,
                    message: "The username you entered is a valid admin username. Please continue with Gmail sign in."
                });
            } else {
                res.send({success: false, message: "Sorry! There is no admin user with the username you provided."});
            }
        });
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
                    var errorMsg;
                    if (error.message.includes("duplicate key error")) {
                        errorMsg = "Admin already exists";
                    }
                    else {
                        errorMsg = "Please Enter a valid ASU Email Id";
                    }
                    res.send({success: false, message: errorMsg});
                } else {
                    res.send({success: true, message: "Admin saved"});
                }
            });
        }
    });

    router.get("/viewAdmin", function (req, res) {
        Admin.find({role: "ADMIN"}, function (error, docs) {
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
            if (err) {
                console.log(err);
                res.send({success: false, error: err});
            } else {
                if (req.body.fullname) {
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

    //http://localhost:8080/api/admin/signOutUser
    router.post('/admin/signOutUser', function (req, res) {
        req.session.reset();
        res.send({success: true, redirectTo: '/'});
    });

    router.get("/viewConf", function (req, res) {
        GameConfig.find({}, function (error, docs) {
            if (error) {
                console.log(error);
                res.send({success: false, message: "Error"});
            } else {
                res.send({success: true, message: "Found configs", data: docs});
            }
        });
    });

    router.post("/deleteConf", function (req, res) {
        GameConfig.findByIdAndRemove(req.body._id, function (error) {
            if (error) {
                console.log(error);
                res.send({success: false, message: "Game Configuration doesn't exist"});
            } else {
                res.send({success: true, message: "Game Configuration deleted"});
            }
        });
    });

    router.post("/updateConf", function (req, res) {
        // set the active config to inactive
        GameConfig.update({active: true}, {$set: {active: false}}, function (error) {
            if (error) {
                console.log(error);
            }
            // activate the required config
            GameConfig.findByIdAndUpdate(req.body._id, {active: true}, function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: "Game Configuration doesn't exist"});
                } else {
                    res.send({success: true, message: "Configuration Activated"});
                }
            });
        });
    });

    router.post("/deactivateConf", function (req, res) {
        // set the active config to inactive
        GameConfig.findByIdAndUpdate(req.body._id, {$set: {active: false}}, function (error) {
            if (error) {
                console.log(error);
                res.send({success: false, message: "Configuration not found"});
            } else {
                res.send({success: true, message: "Configuration Deactivated"});
            }
        });
    });

    router.post("/addToAdminLog", function (req, res) {
        let adminLog = new AdminLog();
        if (req.body.fullname || req.body.username) {
            adminLog.author = req.body.username;
        } else {
            adminLog.author = req.user.username;
        }
        adminLog.action = req.body.action;

        adminLog.save(function (error) {
            if (error) {
                console.log(error);
                res.send({success: false, message: error.errors});
            } else {
                res.send({success: true, message: "Log entry saved"});
            }
        });
    });

    router.post("/exportLogs", function (req, res) {
        /*get from and to date by req.body.fromDate, req.body.toDate*/
        WorkerQueue.checkAvailability()
            .then(function (response) {
                if (response.isAvailable) {
                    const jobData = {
                        fromDate: req.body.fromDate,
                        toDate: req.body.toDate
                    };
                    WorkerQueue.queueJob(req.body.type, req.user.username, jobData)
                        .then(function (job) {
                            return WorkerQueue.executeJob(job);
                        })
                        .then(function () {
                            res.send({
                                success: true,
                                message: "Your job has been queued. Please check the exports tab to view your CSV file."
                            });
                        })
                        .catch(function (error) {
                            console.error(error);
                            res.send({success: false, message: error.message});
                        });
                } else {
                    res.send({success: false, message: response.message});
                }
            })
            .catch(function (error) {
                console.error(error);
                res.send({success: false, message: error.message});
            });

    });

    router.get("/listExports", function (req, res) {
        BackgroundJob.find({ author: req.user.username })
            .sort({createdAt: -1}).exec()
            .then(function (exports) {
                res.send({success: true, data: exports});
            })
            .catch(function (error) {
                console.error(error);
                res.send({success: false, message: error.message});
            })
    });

    router.post('/game/updateUserStatistics', function (req, res) {
        
        TrialInfo.count({username: req.body.username}, function (err, count) {
        
        if(count==0){
            return res.send({success:false, message:'Sorry your request could not be processed'});
        }
       
        let query = {'username': req.body.username};

        let userStatistics = {};


        if (req.body.demographics != undefined) {
            userStatistics.demographics = req.body.demographics;
        }

        else if (req.body.trustAndTaskQuestionnaire != undefined) {
            userStatistics.trustAndTaskQuestionnaire = req.body.trustAndTaskQuestionnaire;
        }

        if (req.body.finalScore != undefined) {
            userStatistics.finalScore = req.body.finalScore;
        }

        if (req.body.moves != undefined) {
            userStatistics.moves = req.body.moves;
        }

        if (req.body.gameConfigId != undefined) {
            userStatistics.gameConfigId = req.body.gameConfigId;
        }

        if (req.body.versionNum != undefined) {
            userStatistics.versionNum = req.body.versionNum;
        }

        if (req.body.timesGameLoaded != undefined) {
            userStatistics.timesGameLoaded = req.body.timesGameLoaded;
        }
        let queryOptions = {
            upsert: true,
            setDefaultsOnInsert: true
        };

        UserStatistics.findOneAndUpdate(query, userStatistics, queryOptions, function (err, doc) {
            if (err) {
                res.send({success: false, message: "User statistics could not be saved"});
            }
            else {
                res.send({success: true, message: "User statistics saved Successfully"});
            }

        });

      });  

    });

    router.get('/home', function (req, res) {
        res.send("Hello from home!");
    });

    router.get('/googleClientId',function(req,res){
        res.send({clientId: configs.googleClientId});
    });
    return router;
};