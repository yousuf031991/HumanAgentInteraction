angular.module('homeControllers', ['authServices'])
    .controller('homeController', function($rootScope, $scope, $window, $route, Auth) {
        $rootScope.$route = $route;

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
        };

        $scope.isSuperAdmin = function () {
            if($rootScope.currentUser && $rootScope.currentUser.role === 'SUPER ADMIN') {
                return true;
            } else {
                return false;
            }
        };

        $scope.isAdmin = function () {
            if($rootScope.currentUser) {
                return true;
            } else {
                return false;
            }
        };

        $scope.logOut = function() {
            Auth.signOutUser({})
                .then(function (response) {
                    $window.location.href = response.data.redirectTo;
                });
        };

    });