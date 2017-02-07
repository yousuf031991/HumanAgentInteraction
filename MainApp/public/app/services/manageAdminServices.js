angular.module('manageAdminServices', [])
    .factory('ManageAdmin', function ($http) {
        manageAdminFactory = {};
        manageAdminFactory.create = function(newAdminData){
            return $http.post('/api/newAdmin', newAdminData);
        };
        manageAdminFactory.view = function(){
            return $http.get('/api/viewAdmin');
        };
        manageAdminFactory.deleteAdm = function(adminEmailData){
            return $http.post('/api/deleteAdmin', adminEmailData);
        };
        return manageAdminFactory;
    });
