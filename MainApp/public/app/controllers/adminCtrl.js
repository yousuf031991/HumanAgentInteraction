angular.module('adminControllers', ['manageAdminServices'])
    .controller('adminController', function ($routeParams) {
        let app = this;

        if ($routeParams.reason && $routeParams.reason === "not_super") {
            app.warningMsg = "Sorry, the route you tried to access is for Super Admin only.";
        }

    }).controller('AccordionDemoCtrl', function ($scope, Admin) {
        $scope.loading = false;
        $scope.errorMsg = false;
        $scope.successMsg = false;

        $scope.deleteConf = function (id){
            $scope.loading = true;
            let deleteData = JSON.stringify({_id: id});
            Admin.delete(deleteData).then(function (returnData) {
                if (returnData.data.success) {
                   /* $timeout(function () {
                    }, 500);*/
                    $scope.successMsg = returnData.data.message;
                    for (key in $scope.confList) {
                        if ($scope.confList[key]._id == id) {
                            $scope.confList.splice(key, 1);
                        }
                    }
                } else {
                    $scope.errorMsg = returnData.data.message;
                }
            });
            $scope.loading = false;
        };

        $scope.updateConf = function (id, active) {
            $scope.loading = true;
            let updateData = JSON.stringify({_id: id});
            if(!active) {
                Admin.update(updateData).then(function (returnData) {
                    if (returnData.data.success) {
                        $scope.successMsg = returnData.data.message;
                        for (key in $scope.confList) {
                            if ($scope.confList[key]._id == id) {
                                $scope.confList[key].active = true;
                            } else {
                                $scope.confList[key].active = false;
                            }
                        }
                    } else {
                        $scope.errorMsg = returnData.data.message;
                    }
                });
            } else {
                Admin.deactivate(updateData).then(function (returnData) {
                    if (returnData.data.success) {
                        $scope.successMsg = returnData.data.message;
                        for (key in $scope.confList) {
                            if ($scope.confList[key]._id == id) {
                                $scope.confList[key].active = false;
                            }
                        }
                    } else {
                        $scope.errorMsg = returnData.data.message;
                    }
                });
            }
            $scope.loading = false;
        };

        $scope.listConfigs = function () {
            Admin.view().then(function (returnData) {
                if (returnData.data.success) {
                    $scope.confList = returnData.data.data;
                    for (key in $scope.confList) {
                        $scope.confList[key].createdAt =
                            new Date($scope.confList[key].createdAt).toLocaleString();
                    }
                }
            });
        };
    });