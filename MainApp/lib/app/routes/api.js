import Admin from '../models/user';
import TrialInfo from '../models/trialinfo';
import GameConfig from '../models/gameConfig';
import Game from '../models/game';
import request from 'request';
import UserStatistics from '../models/UserStatistics'


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

        // TODO: Query the gameConfigId, userStatsId
        let gameParams = {"gameConfigId": 3, "trialInfoId": trialinfo.trialid, "username": trialinfo.username, "userStatsId": 3};
        
        if (trialinfo.username == null || trialinfo.username == '' || trialinfo.trialid == null || trialinfo.trialid == '' || trialinfo.condition == null ||trialinfo.condition == '') {
            res.send({success: false, message: 'Username or trialid or condition was empty' + trialinfo.username + ' ID:' +trialinfo.trialid + 'CON:' + trialinfo.condition});
        } else {
            trialinfo.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: "Username already exists"});
                } else {
                    request.post({
                        url:'http://localhost:8080/api/gameinfo', 
                        body: gameParams,
                        json: true
                    }, function(err, response, body){
                        console.log(err);
                        console.log(response);
                        console.log(body);
                    });

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

        if (gameConfig.cooperation == null || gameConfig.cooperation == '') {
            res.send({success: false, message: 'Cooperation was empty'});
        } else {
            gameConfig.save(function (error) {
                if (error) {
                    console.log(error);
                    res.send({success: false, message: error});
                } else {
                    res.send({success: true, message: "Game config saved"});
                }
            });
        }
    });

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

    router.post('/userStatistics', function(req, res) {

        let userStatistics = new UserStatistics();
        userStatistics.username = req.body.username;
        userStatistics.finalScore = req.body.finalScore;

        userStatistics.save(function (err) {
            
            console.log("Printing userStatistics")
            console.log(userStatistics)
            if (err) {
                    console.log(err);
                    res.send({success: false, message: "Userstatiscts row not created"});
                } else {
                    res.send({success: true, message: "Userstatiscts row created"});
                }
        });
    });


    router.get('/home', function (req, res) {
        res.send("Hello from home!");
    });
    return router;
};
