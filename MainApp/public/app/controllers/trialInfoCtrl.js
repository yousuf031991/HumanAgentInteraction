angular.module('trialInfoControllers', ['trialInfoServices'])
    .controller('trialInfoCtrl', function ($http, $location, $rootScope, $cookies,TrialInfo) {
        var app = this;
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
                    var date=new Date();
                    date.setFullYear(date.getFullYear()+10);
                    var options={};
                    options.expires=date;
                    $cookies.putObject($rootScope.COOKIE_NAME,gameSession,options);
                    $location.path('/demographics');
                } else {
                    $location.path('/thankyou');
                    app.errorMsg = returnData.data.message;
                }
                app.loading = false;
            });
        };
    });