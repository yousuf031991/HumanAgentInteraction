angular.module('manageGameControllers', [])
    .controller('manageGameCtrl', function ($rootScope,$location,$cookies) {
        var app = this;
        app.username=null;
        app.latestStage=-1;
       

        this.getTrialData=function(){
            console.log("Manage Game controller");
            $rootScope.checkActiveTabs();

            var gameSession=$rootScope.getSession();
            if(gameSession.lastStageCompleted==0){
                $location.path('/trialInfo');

            }
            else{ //If the game has been started from this client in past.
                                   
                var username=gameSession.username;
                $rootScope.username=app.username=username;
                app.latestStage=gameSession.lastStageCompleted;
                
                var timeout=$rootScope.checkTimeout(gameSession);

                if(!timeout){

                    switch(app.latestStage){

                        case $rootScope.TRIALINFO_PAGE: {$location.path('/demographics'); break;}

                        case $rootScope.DEMOGRAPHICS_QUESTIONNAIRE: {$location.path('/gamepage/'+app.username); break;}

                        case $rootScope.GAMEPAGE: {$location.path('/trustAndTaskQuestionnaire'); break;}

                        case $rootScope.TRUST_TASK_QUESTIONNAIRE: {$location.path('/thankyou'); break;}

                        default: {$location.path('/trialinfo'); break;}

                    }

                }


                else{
                        $location.path('/timeout');                             
                }

            }


        }
        this.getTrialData();
    });