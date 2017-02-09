angular.module('appRoutes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
            templateUrl: 'app/views/pages/home.html', controller: 'authController', controllerAs: 'signIn'
        })
        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })
        .when('/adminpage', {
            templateUrl: 'app/views/pages/admin/adminPage.html'
        })
        .when('/adminlogin', {
            templateUrl: 'app/views/pages/authentication/login.html'
        })
        .when('/trialinfo', {
            templateUrl: 'app/views/pages/trialinfo/trialInfoPage.html' , controller: 'trialInfoCtrl', controllerAs: 'trialData'
        })
        .when('/gamepage/:username', {
            templateUrl: 'app/views/pages/game/game.html', controller: 'gamePageCtrl', controllerAs: 'gameData'
        })
        .when('/gameconfigpage', {
            templateUrl: 'app/views/pages/admin/gameConfigPage.html' , controller: 'gameConfigCtrl', controllerAs: 'gameConf'
        })
        .when('/manageAdmin', {
            templateUrl: 'app/views/pages/admin/manageAdmin.html' , controller: 'manageAdminCtrl', controllerAs: 'manageAdm'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
