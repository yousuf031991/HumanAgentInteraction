angular.module('adminServices', [])
    .factory('Admin', function ($http) {
        adminFactory = {};
        adminFactory.deactivate = function(deactivateData){
            return $http.post('/api/deactivateConf', deactivateData);
        };
        adminFactory.update = function(updateData){
            return $http.post('/api/updateConf', updateData);
        };
        adminFactory.view = function(){
            return $http.get('/api/viewConf');
        };
        adminFactory.delete = function(deleteData){
            return $http.post('/api/deleteConf', deleteData);
        };
        return adminFactory;
    });
