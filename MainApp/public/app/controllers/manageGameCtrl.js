angular.module('manageGameControllers', [])
    .controller('manageGameCtrl', function ($rootScope,$location,$cookies) {
        var app = this;
        app.username=null;
        app.latestStage=-1;

        $rootScope.TRIALINFO_PAGE=1;
        $rootScope.DEMOGRAPHICS_QUESTIONNAIRE=2;
        $rootScope.GAMEPAGE=3;
        $rootScope.TRUST_TASK_QUESTIONNAIRE=4; 
        $rootScope.THANKYOU_PAGE=5;
        
        this.getTrialData=function(){
            var gameSession=$cookies.get('HospitalManagementGame');
            var date=new Date();
            var year=date.getFullYear();
            date.setFullYear(year+10);
            var gameSessionOptions={};
            gameSessionOptions.expires=date;
            $cookies.put('HospitalManagementGame','ON', gameSessionOptions); //The value 'ON' is simply a placeholder. It could be any valid string

            if(gameSession){ //If the game has been started from this client in past.
                
                var trialSession=$cookies.getObject('Trial');
                 
                if(trialSession){    
                    var username=trialSession.username;
                    $rootScope.username=app.username=username;
                    app.latestStage=trialSession.lastStage;


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
                
                    var trialExpiryDate=new Date();
                    trialExpiryDate.setHours(trialExpiryDate.getHours()+2);
                    var trialOptions={expires:trialExpiryDate};
                    var trialData={};
                    $cookies.putObject('Trial',trialData,trialOptions);
                    $location.path('/trialInfo');

            }

        }
        this.getTrialData();
    });