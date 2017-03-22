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
                    //$location.path('/gamepage/'+username);
                    $rootScope.username=username;
                    //$location.path('/gamepage/'+username);
                    var trialSession=$cookies.getObject('Trial');
                    trialSession.lastStage=$rootScope.TRIALINFO_PAGE;
                    trialSession.username=username;
                    $cookies.putObject('Trial',trialSession);
                    $location.path('/demographics');
                } else {
                    $location.path('/thankyou');
                    app.errorMsg = returnData.data.message;
                }
                app.loading = false;
            });
        };
    });