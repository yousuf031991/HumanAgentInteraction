angular.module('adminControllers', ['manageAdminServices', 'reportServices', 'scrollingServices'])
    .controller('adminController', function ($routeParams) {
        let app = this;

        if ($routeParams.reason && $routeParams.reason === "not_super") {
            app.warningMsg = "Sorry, the route you tried to access is for Super Admin only.";
        }

    }).controller('AccordionDemoCtrl', function ($scope, Admin, Report, Scrolling) {
        $scope.loading = false;
        $scope.errorMsg = false;
        $scope.successMsg = false;
        Scrolling('adminLoader');

        $scope.deleteConf = function (id) {
            $scope.loading = true;
            let deleteData = JSON.stringify({_id: id});
            Admin.delete(deleteData).then(function (returnData) {
                if (returnData.data.success) {
                    $scope.successMsg = returnData.data.message;
                    for (key in $scope.confList) {
                        if ($scope.confList[key]._id == id) {
                            $scope.confList.splice(key, 1);
                        }
                    }
                    Scrolling('adminSuccess');
                    // Log in adminLog
                    const reportData = {action: "Deleted Configuration: " + id};
                    Report.putLog(reportData);
                } else {
                    $scope.errorMsg = returnData.data.message;
                    Scrolling('adminFailure');
                }
            });
            $scope.loading = false;
        };

        $scope.updateConf = function (id, active) {
            $scope.loading = true;
            Scrolling('adminLoader');
            let updateData = JSON.stringify({_id: id});
            if (!active) {
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
                        Scrolling('adminSuccess');
                        // Log in adminLog
                        const reportData = {action: "Activated Configuration: " + id};
                        Report.putLog(reportData);
                    } else {
                        $scope.errorMsg = returnData.data.message;
                        Scrolling('adminFailure');
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
                        Scrolling('adminSuccess');
                        // Log in adminLog
                        const reportData = {action: "Deactivated Configuration: " + id};
                        Report.putLog(reportData);
                    } else {
                        $scope.errorMsg = returnData.data.message;
                        Scrolling('adminFailure');
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