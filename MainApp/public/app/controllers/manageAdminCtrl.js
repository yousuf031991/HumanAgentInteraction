angular.module('manageAdminControllers', ['manageAdminServices'])
    .controller('manageAdminCtrl', function (ManageAdmin, $scope) {
        $scope.createNewAdmin = function () {
            $scope.successMsg = false;
            $scope.errorMsg = false;
            $scope.loading = true;
            $scope.user = JSON.stringify({username: $scope.username});
            ManageAdmin.create($scope.user).then(function (returnData) {
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

        $scope.removeAdmin = function(adminUserName){
            adminUserName = JSON.stringify({username: adminUserName});
            ManageAdmin.deleteAdm(adminUserName).then(function (returnData){
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
