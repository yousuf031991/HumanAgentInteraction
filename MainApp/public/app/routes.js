angular.module('appRoutes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/views/pages/home.html', controller: 'signInCtrl', controllerAs: 'signIn'
        })
        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })
        .when('/adminpage', {
            templateUrl: 'app/views/pages/admin/adminPage.html'
        })
        .when('/trialinfo', {
            templateUrl: 'app/views/pages/trialinfo/trialInfoPage.html' , controller: 'trialInfoCtrl', controllerAs: 'trialData'
        })
        .when('/gamepage', {
            templateUrl: 'app/views/pages/game/game.html'
        })
        .when('/gameconfigpage', {
            templateUrl: 'app/views/pages/admin/gameConfigPage.html' , controller: 'gameConfigCtrl', controllerAs: 'gameConf'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
