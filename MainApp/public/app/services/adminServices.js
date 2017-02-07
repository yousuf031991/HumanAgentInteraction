angular.module('adminServices', [])
    .factory('Admin', function ($http) {
        adminFactory = {};
        adminFactory.create = function(signInData){
                return $http.post('/api/admin', signInData);
        };

        adminFactory.verify=function(signInData){
                return $http.post('/api/adminLogin', signInData);
        }; 

        return adminFactory;
    });
