angular.module('authServices', [])
    .factory('Auth', function ($http) {
        authFactory = {};
        authFactory.create = function(authData) {
            return $http.post('/api/adminLogin', authData);
        };
        return authFactory;
    });
