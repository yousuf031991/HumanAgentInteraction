angular.module('reportServices', [])
    .factory('Report', function ($http) {
        reportFactory = {};
        reportFactory.report = function(dateData){
            return $http.get('/api/exportAdminReports', dateData);
        };
        reportFactory.getLog = function(dateData){
            return $http.get('/api/exportAdminLogs', dateData);
        };
        reportFactory.putLog = function(logData){
            return $http.post('/api/addToAdminLog', logData);
        };
        return reportFactory;
    });
