angular.module('manageGameControllers', [])
    .controller('manageGameCtrl', function ($rootScope,$location,$cookies) {
        var app = this;
        app.username=null;
        app.latestStage=-1;

        $rootScope.COOKIE_NAME='HospitalManagementGame';
        $rootScope.TRIALINFO_PAGE=1;
        $rootScope.DEMOGRAPHICS_QUESTIONNAIRE=2;
        $rootScope.GAMEPAGE=3;
        $rootScope.TRUST_TASK_QUESTIONNAIRE=4; 
        $rootScope.THANKYOU_PAGE=5;
        
        this.getTrialData=function(){
            var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
            if(gameSession){ //If the game has been started from this client in past.
                
                var trialExpiry=new Date(gameSession.trialEnds);
                                   
                var username=gameSession.username;
                $rootScope.username=app.username=username;
                app.latestStage=gameSession.lastStageCompleted;

                var currentTime=new Date();

                if(currentTime<=trialExpiry){

                    switch(app.latestStage){

                        case $rootScope.TRIALINFO_PAGE: {$location.path('/demographics'); break;}

                        case $rootScope.DEMOGRAPHICS_QUESTIONNAIRE: {$location.path('/gamepage/'+app.username); break;}

                        case $rootScope.GAMEPAGE: {$location.path('/trustAndTaskQuestionnaire'); break;}

                        case $rootScope.TRUST_TASK_QUESTIONNAIRE: {$location.path('/thankyou'); break;}

                        default: {$location.path('/trialinfo'); break;}

                    }

                }


                else{
                        $location.path('/thankyou');                             
                }

            }

            else{
                
                    var trialExpiry=new Date();
                    trialExpiry.setHours(trialExpiry.getHours()+2);
                    var date=new Date();
                    date.setFullYear(date.getFullYear()+10);
                    var options={};
                    options.expires=date;
                    var gameSession={};
                    gameSession.trialEnds=trialExpiry.toUTCString(); 
                    $cookies.putObject($rootScope.COOKIE_NAME,gameSession, options); 
                    $location.path('/trialInfo');

            }

        }
        this.getTrialData();
    });