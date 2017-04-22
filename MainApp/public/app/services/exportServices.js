angular.module('exportServices', [])
    .factory('Export', function ($http) {
        let exportFactory = {};
        exportFactory.list = function() {
            return $http.get('/api/listExports');
        };
        return exportFactory;
    });
