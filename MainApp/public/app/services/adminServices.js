angular.module('adminServices', [])
    .factory('Admin', function ($http) {
        adminFactory = {};
        adminFactory.create = function(signInData){
        	console.log("In adminservices");
            return $http.post('/api/adminLogin', signInData);
        };
        return adminFactory;
    });
