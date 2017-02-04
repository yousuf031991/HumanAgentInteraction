angular.module('gameConfigControllers', ['gameConfigServices'])
    .controller('gameConfigCtrl', function ($http, $location, $scope, GameConfig, $timeout) {
        var app = this;
        $scope.coopData = {
            availableOptions: [
                {name: 'High Cooperation'},
                {name: 'Low Cooperation'}
            ],
            selectedOption: {name: 'High Cooperation'}
        };
        this.gameConfig = function (gameConfigData, valid) {
            app.errorMsg = false;
            app.loading = true;
            if (valid) {
                GameConfig.create(app.gameConfigData).then(function (returnData) {
                    if (returnData.data.success) {
                        app.successMsg = returnData.data.message + "....Redirecting";
                        $timeout(function () {
                            $location.path('/');
                        }, 2000);
                    } else {
                        app.errorMsg = returnData.data.message;
                    }
                    app.loading = false;
                });
            } else {
                app.loading = false;
                app.errorMsg = "Please ensure the form is filled out properly";
            }
        };
    });
