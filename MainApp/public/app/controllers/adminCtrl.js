angular.module('adminControllers', ['adminServices'])
    .controller('signInCtrl', function ($http, $location, Admin) {
        var app = this;
        this.signInAdmin = function (signInData) {
            app.errorMsg = false;
            app.loading = true;
            Admin.create(app.signInData).then(function (returnData) {
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
