angular.module('trialInfoControllers', ['trialInfoServices', 'scrollingServices'])
    .controller('trialInfoCtrl', function ($http, $location, $rootScope, $cookies, $routeParams, TrialInfo, $scope, Scrolling) {
        var app = this;
        app.username=null;
        app.latestStage=-1;

        this.getAppState=function(){
            var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
            
            let version=$routeParams.version;

            if(version==undefined)
                  version=1;

            if(gameSession){ //If the game has been started from this client in past.
                
                var trialExpiry=new Date(gameSession.trialEnds);
                                   
                var username=gameSession.username;
                $rootScope.username=app.username=username;
                app.latestStage=gameSession.lastStageCompleted;

                var currentTime=new Date();

                if(currentTime<=trialExpiry){

                    let data={
                                version:version
                             }
                    $rootScope.updateGameSession(data);

                    switch(app.latestStage){

                        case $rootScope.TRIALINFO_PAGE: {$location.path('/demographics'); break;}

                        case $rootScope.DEMOGRAPHICS_QUESTIONNAIRE: {$location.path('/tutorialPage'); break;}// ToDo - edirect to tutorial page

                        case $rootScope.TUTORIAL:{$location.path('/practicePage');break;}

                        case $rootScope.PRACTICE_GAME:{$location.path('/gamepage/'+app.username); break;}

                        case $rootScope.GAMEPAGE: {$location.path('/trustAndTaskQuestionnaire'); break;}

                        case $rootScope.TRUST_TASK_QUESTIONNAIRE: {$location.path('/thankyou'); break;}

                        
                    }

                    
                }


                else{
                        $location.path('/timeout');                             
                }

            }

            else{
                    $rootScope.createGameSession(version);                    
            }

        };



        this.trialInfoData = function (trailData) {
            app.errorMsg = false;
            app.loading = true;
            Scrolling('trialLoader');
            if(!$scope.trialCheck){
                app.errorMsg = "Please agree to the terms and conditions!";
                Scrolling('trialError');
            } else {
                TrialInfo.create(app.trailData).then(function (returnData) {
                    if (returnData.data.success) {
                        Scrolling('trialSuccess');
                        app.successMsg = returnData.data.message;
                        let username = returnData.data.userid;
                        var gameSession = $cookies.getObject($rootScope.COOKIE_NAME);
                        var data={
                                    lastStageCompleted:$rootScope.TRIALINFO_PAGE,
                                    username:username
                                 }
                        $rootScope.updateGameSession(data);        

                        $location.path('/demographics');
                    } else {
                        Scrolling('trialError');
                        app.errorMsg = returnData.data.message;
                    }
                });
            }
            app.loading = false;
        };

        this.getAppState();
    });