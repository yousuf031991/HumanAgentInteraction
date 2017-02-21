angular.module('authServices', [])
    .factory('Auth', function ($http) {
        authFactory = {};
        authFactory.create = function(authData) {
            return $http.post('/api/adminLogin', authData);
        };

        authFactory.verify=function(signInData){
            return $http.post('/api/admin/login', signInData);
        };

        authFactory.signInUser = function(data){
            return $http.post('/api/admin/signInUser', data);
        };

        authFactory.signOutUser = function(data){
            return $http.post('/api/admin/signOutUser', data);
        };

        return authFactory;
    });
