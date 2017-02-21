angular.module('gameConfigControllers', ['gameConfigServices'])
    .controller('gameConfigCtrl', function ($location, GameConfig, $timeout) {
        let app = this;
        this.gameConfig = function (gameConfigData, valid) {
            app.errorMsg = false;
            app.loading = true;
            if (valid) {
                GameConfig.create(app.gameConfigData).then(function (returnData) {
                    if (returnData.data.success) {
                        app.successMsg = returnData.data.message + "....Redirecting";
                        $timeout(function () {
                            $location.path('/');
                        }, 1500);
                    } else {
                        app.errorMsg = "";
                        for (key in returnData.data.message){
                            app.errorMsg += returnData.data.message[key].message +"\n";
                        }
                    }
                    app.loading = false;
                });
            } else {
                app.loading = false;
                app.errorMsg = "Please ensure the form is filled out properly";
            }
        };
    });
