angular.module('authServices', [])
    .factory('Auth', function ($http) {
        authFactory = {};
        authFactory.create = function(authData) {
            return $http.post('/api/adminLogin', authData);
        };
        authFactory.verify=function(signInData){
                return $http.post('/api/adminLogin', signInData);
        };  

        return authFactory;
    });
