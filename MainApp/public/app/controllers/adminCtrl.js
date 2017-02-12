angular.module('adminControllers', [])
    .controller('adminController', function($routeParams) {
        let app = this;

        if($routeParams.reason && $routeParams.reason === "not_super") {
            app.warningMsg = "Sorry, the route you tried to access is for Super Admin only.";
        }

    });