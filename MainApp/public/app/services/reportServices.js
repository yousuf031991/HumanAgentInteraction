angular.module('reportServices', [])
    .factory('Report', function ($http) {
        let reportFactory = {};
        reportFactory.getLogs = function(data){
            return $http.post('/api/exportLogs', data);
        };
        reportFactory.putLog = function(logData){
            return $http.post('/api/addToAdminLog', logData);
        };
        return reportFactory;
    });
