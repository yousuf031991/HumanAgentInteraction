angular.module('adminControllers', [])
    .controller('signInCtrl', function ($http, $location) {
        var app = this;
        this.signInAdmin = function (signInData) {
            app.errorMsg = false;
            app.loading = true;
            $http.post('/api/admin', this.signInData).then(function (returnData) {
                if (returnData.data.success) {
                    app.successMsg = returnData.data.message;
                    $location.path('/adminpage');
                } else {
                    app.errorMsg = returnData.data.message;
                }
                app.loading = false;
            });
        };
    });
