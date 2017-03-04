angular.module('trialInfoControllers', ['trialInfoServices'])
    .controller('trialInfoCtrl', function ($http, $location, TrialInfo,$rootScope) {
        var app = this;
        this.trialInfoData = function (trailData) {
            app.errorMsg = false;
            app.loading = true;
            TrialInfo.create(app.trailData).then(function (returnData) {
                if (returnData.data.success) {
                    app.successMsg = returnData.data.message;
                    var username = app.trailData.username;
                    $rootScope.username=username;
                    console.log("Trial Username:"+username);
                    //$location.path('/gamepage/'+username);
                    $location.path('/preGameQuestionnaire');
                } else {
                    app.errorMsg = returnData.data.message;
                }
                app.loading = false;
            });
        };
    });