angular.module('manageAdminControllers', ['manageAdminServices', 'reportServices', 'scrollingServices'])
    .controller('manageAdminCtrl', function (ManageAdmin, $scope, Report, Scrolling) {
        $scope.createNewAdmin = function () {
            $scope.loading = true;
            Scrolling('loader');
            $scope.user = JSON.stringify({username: $scope.adminUsername});
            ManageAdmin.create($scope.user).then(function (returnData) {
                $scope.failureDeleteMsg = false;
                $scope.successDeleteMsg = false;
                if (returnData.data.success) {
                    $scope.successAddMsg = returnData.data.message;
                    $scope.errorAddMsg = false;
                    $scope.addAdminToUI($scope.user);
                    Scrolling('addSuccess');

                    // Log in adminLog
                    const reportData = {action: "Created Admin: " + $scope.adminUsername};
                    Report.putLog(reportData);
                } else {
                    $scope.successAddMsg = false;
                    $scope.errorAddMsg = returnData.data.message;
                    Scrolling('addFailure');
                }
                $scope.loading = false;
            });
        };

        $scope.removeAdmin = function (adminName) {
            var confirmDelete = confirm("Are you sure yo want to delete " + adminName + " from the list of admins?");
            if (!confirmDelete)
                return;
            adminUserName = JSON.stringify({username: adminName});
            ManageAdmin.deleteAdm(adminUserName).then(function (returnData) {
                $scope.successAddMsg = false;
                $scope.errorAddMsg = false;
                if (returnData.data.success) {
                    $scope.failureDeleteMsg = false;
                    $scope.successDeleteMsg = returnData.data.message;
                    $scope.removeAdminFromUI(adminUserName);
                    Scrolling('deleteSuccess');
                    // Log in adminLog
                    const reportData = {action: "Deleted Admin: " + adminName};
                    Report.putLog(reportData);
                } else {
                    $scope.failureDeleteMsg = returnData.data.message;
                    $scope.successDeleteMsg = false;
                    Scrolling('deleteFailure');
                }
            });
        };

        $scope.listAdmin = function () {
            ManageAdmin.view().then(function (returnData) {
                if (returnData.data.success) {
                    $scope.adminList = returnData.data.data;
                }
            });
        };


        $scope.removeAdminFromUI = function (adminUser) {
            adminUser = JSON.parse(adminUser);
            var index;
            var len = $scope.adminList.length;
            var i;
            var adminUserName = adminUser.username;
            for (i = 0; i < len; i++) {
                var username = ($scope.adminList)[i].username;
                if (username == adminUserName) {
                    index = i;
                    break;
                }
            }
            $scope.adminList.splice(index, 1);
        };

        $scope.addAdminToUI = function (adminUser) {
            adminUser = JSON.parse(adminUser);
            $scope.adminList.push(adminUser);
        };

    });
