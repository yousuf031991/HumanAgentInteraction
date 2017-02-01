angular.module('gameConfigControllers', ['gameConfigServices'])
    .controller('gameConfigCtrl', function ($http, $location, $scope, GameConfig) {
        var app = this;
        $scope.coopData = {
            availableOptions: [
                {name: 'High Cooperation'},
                {name: 'Low Cooperation'}
            ],
            selectedOption: {name: 'High Cooperation'}
        };
        this.gameConfig = function (gameConfigData) {
            app.errorMsg = false;
            app.loading = true;
            GameConfig.create(app.gameConfigData).then(function (returnData) {
                if (returnData.data.success) {
                    app.successMsg = returnData.data.message;
                    $location.path('/');
                } else {
                    app.errorMsg = returnData.data.message;
                }
                app.loading = false;
            });
        };
    });
