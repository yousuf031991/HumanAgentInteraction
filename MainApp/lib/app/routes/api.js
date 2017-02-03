import Admin from '../models/user';
import TrialInfo from '../models/trialinfo';
import GameConfig from '../models/gameConfig';

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
            res.send({success: false, message: 'Cooperation was empty was empty'});
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
    
//http://localhost:8080/api/adminLogin
router.post("/adminLogin",function(req,res){
   console.log("Received...");
   var admin=new Admin();
   var emailID=req.body.email;
   console.log("Email:"+emailID);
   Admin.count({username: emailID},function(err,count){
      //console.log("Count:"+count);
      if(count>0){
         //console.log("Admin Exists");
         res.send(true);
      }
      else{
         res.send(false);
      }
   });
});

    router.get('/home', function (req, res) {
        res.send("Hello from home!");
    });
    return router;
};
