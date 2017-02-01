angular.module('gameConfigServices', [])
    .factory('GameConfig', function ($http) {
        gameConfigFactory = {};
        gameConfigFactory.create = function(gameConfigData){
            return $http.post('/api/gameConfig', gameConfigData);
        };
        return gameConfigFactory;
    });
