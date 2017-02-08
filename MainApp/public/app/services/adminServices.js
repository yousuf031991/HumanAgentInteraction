angular.module('adminServices', [])
    .factory('Admin', function ($http) {
        adminFactory = {};
        adminFactory.create = function(signInData){
                return $http.post('/api/admin', signInData);
        };

        return adminFactory;
    });
