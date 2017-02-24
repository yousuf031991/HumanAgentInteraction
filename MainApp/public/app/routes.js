angular.module('appRoutes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/about', {
            templateUrl: 'app/views/pages/about.html', activeTab: 'about'
        })        
        .when('/thankyou', {
            templateUrl: 'app/views/pages/thankyou.html', activeTab: 'thankyou'
        })
        .when('/admin', {
            templateUrl: 'app/views/pages/admin/adminPage.html', controller: 'adminController', controllerAs: 'admin', activeTab: 'adminPanel'
        })
        .when('/admin/login', {
            templateUrl: 'app/views/pages/authentication/login.html', controller: 'authController', controllerAs: 'signIn', isLogin: true
        })
        .when('/', {
            templateUrl: 'app/views/pages/trialinfo/trialInfoPage.html' , controller: 'trialInfoCtrl', controllerAs: 'trialData', activeTab: 'playGame'
        })
        .when('/gamepage/:username', {
            templateUrl: 'app/views/pages/game/game.html', controller: 'gamePageCtrl', controllerAs: 'gameData'
        })
        .when('/admin/gameconfig', {
            templateUrl: 'app/views/pages/admin/gameConfigPage.html' , controller: 'gameConfigCtrl', controllerAs: 'gameConf', activeTab: 'gameConf'
        })
        .when('/admin/manage', {
            templateUrl: 'app/views/pages/admin/manageAdmin.html' , controller: 'manageAdminCtrl', controllerAs: 'manageAdm', activeTab: 'manageAdm'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});