angular.module('trialInfoControllers', ['trialInfoServices'])
    .controller('trialInfoCtrl', function ($http, $location, $rootScope, $cookies,TrialInfo) {
        var app = this;
        app.username=null;
        app.latestStage=-1;


        this.getAppState=function(){
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

                        
                    }

                }


                else{
                        $location.path('/timeout');                             
                }

            }

            else{
                    $rootScope.createGameSession();                    
            }

        }



        this.trialInfoData = function (trailData) {
            app.errorMsg = false;
            app.loading = true;
            TrialInfo.create(app.trailData).then(function (returnData) {
                if (returnData.data.success) {
                    app.successMsg = returnData.data.message;
                    // var username = app.trailData.username;
                    let username = returnData.data.userid;
                    var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
                    gameSession.lastStageCompleted=$rootScope.TRIALINFO_PAGE;
                    gameSession.username=username;
                    $rootScope.username=username;
                    $cookies.putObject($rootScope.COOKIE_NAME,gameSession,$rootScope.getCookieOptions());
                    $location.path('/demographics');
                } else {
                    $location.path('/thankyou');
                    app.errorMsg = returnData.data.message;
                }
                app.loading = false;
            });
        };

        this.getAppState();
    });