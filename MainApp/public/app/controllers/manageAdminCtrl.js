angular.module('manageAdminControllers', ['manageAdminServices'])
    .controller('manageAdminCtrl', function (ManageAdmin, $scope) {
        $scope.createNewAdmin = function () {
            $scope.successMsg = false;
            $scope.errorMsg = false;
            $scope.loading = true;
            $scope.email = JSON.stringify({emailId: $scope.emailId});
            ManageAdmin.create($scope.email).then(function (returnData) {
                if (returnData.data.success) {
                    $scope.successMsg = returnData.data.message;
                    $scope.adminList = false;
                    $scope.listAdmin();
                } else {
                    $scope.errorMsg = returnData.data.message;
                }
                $scope.loading = false;
            });
        };

        $scope.removeAdmin = function(adminEmail){
            adminEmail = JSON.stringify({emailId: adminEmail});
            ManageAdmin.deleteAdm(adminEmail).then(function (returnData){
                if (returnData.data.success) {
                    // TODO: Add some indicator of success or failure
                    //console.log(returnData.data.message);
                    $scope.adminList = false;
                    $scope.listAdmin();
                } else {
                    //console.log(returnData.data.message);
                }
            });
        };

        $scope.adminList = false;
        $scope.listAdmin = function(){
            ManageAdmin.view().then(function (returnData) {
                if (returnData.data.success) {
                    $scope.adminList = returnData.data.data;
                }
            });
        };
    });
