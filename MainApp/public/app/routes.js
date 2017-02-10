angular.module('appRoutes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })
        .when('/admin', {
            templateUrl: 'app/views/pages/admin/adminPage.html'
        })
        .when('/admin/login', {
            templateUrl: 'app/views/pages/authentication/login.html', controller: 'authController', controllerAs: 'signIn'
        })
        .when('/', {
            templateUrl: 'app/views/pages/trialinfo/trialInfoPage.html' , controller: 'trialInfoCtrl', controllerAs: 'trialData'
        })
        .when('/gamepage/:username', {
            templateUrl: 'app/views/pages/game/game.html', controller: 'gamePageCtrl', controllerAs: 'gameData'
        })
        .when('/admin/gameconfig', {
            templateUrl: 'app/views/pages/admin/gameConfigPage.html' , controller: 'gameConfigCtrl', controllerAs: 'gameConf'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
