angular.module('homeControllers', [])
    .controller('homeController', function($rootScope, $scope) {
        $scope.setCurrentUser = function (user) {
            if(user) {
                $rootScope.currentUser = user;
            } else {
                $rootScope.currentUser = undefined;
            }
        };

        $rootScope.fetchDisplayName = function () {
            let displayName = "";
            if($rootScope.currentUser) {
                if($rootScope.currentUser.fullname) {
                    displayName = $rootScope.currentUser.fullname;
                } else {
                    displayName = $rootScope.currentUser.username;
                }
            } else {
                displayName = "Admin";
            }
            return displayName;
        }

    });