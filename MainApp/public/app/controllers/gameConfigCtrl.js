angular.module('gameConfigControllers', ['gameConfigServices', 'reportServices', 'scrollingServices'])
    .controller('gameConfigCtrl', function ($location, GameConfig, $timeout, Report, Scrolling) {
        let app = this;
        this.gameConfig = function (gameConfigData, valid) {
            app.errorMsg = false;
            app.loading = true;
            Scrolling('configLoader');
            if (valid) {
                GameConfig.create(app.gameConfigData).then(function (returnData) {
                    if (returnData.data.success) {
                        app.successMsg = returnData.data.message + "....Redirecting";

                        // Log in adminLog
                        const reportData = {action: "Created Config: " + returnData.data.configId};
                        Report.putLog(reportData);
                        Scrolling('configSuccess');
                        $timeout(function () {
                            $location.path('/admin');
                        }, 1500);
                    } else {
                        app.errorMsg = "";
                        for (key in returnData.data.message) {
                            app.errorMsg += returnData.data.message[key].message + "\n";
                        }
                        Scrolling('configFailure');
                    }
                    app.loading = false;
                });
            } else {
                app.loading = false;
                app.errorMsg = "Please ensure the form is filled out properly";
                Scrolling('configFailure');
            }
        };
    });
