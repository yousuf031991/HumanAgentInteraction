angular.module('trialInfoControllers', ['trialInfoServices','refreshServices'])
    .controller('trialInfoCtrl', function ($http, $location, $rootScope, $cookies,TrialInfo,Refresh) {
        var app = this;
        var gameSession=$cookies.getObject($rootScope.COOKIE_NAME)
        if(gameSession){
            if(gameSession.lastStageCompleted){
                Refresh.checkRefresh();
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
                    $rootScope.username=username;
                    var data={
                                username:username,
                                lastStageCompleted:$rootScope.TRIALINFO_PAGE
                             };
                    $rootScope.updateGameSession(data);

                    $location.path('/demographics');
                } else {
                    $location.path('/thankyou');
                    app.errorMsg = returnData.data.message;
                }
                app.loading = false;
            });
        };
    });