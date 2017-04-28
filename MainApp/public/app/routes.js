angular.module('appRoutes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/thankyou', {
            templateUrl: 'app/views/pages/thankyou.html', activeTab: 'thankyou'
        })

        .when('/timeout', {
            templateUrl: 'app/views/pages/sessionTimeout.html', activeTab: 'thankyou'
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
        .when('/admin/reporting', {
            templateUrl: 'app/views/pages/admin/reporting.html' , controller: 'reportCtrl', controllerAs: 'report', activeTab: 'reporting'
        })
        .when('/admin/exports', {
            templateUrl: 'app/views/pages/admin/exports.html' , controller: 'exportCtrl', controllerAs: 'export', activeTab: 'exports'
        })
        .when('/demographics', {
            templateUrl: 'app/views/pages/game/demographics.html' , controller: 'preGameQuestionnaireCtrl', controllerAs: 'preGameQuestionnaire', activeTab: 'playGame'
        })
        .when('/trustAndTaskQuestionnaire', {
            templateUrl: 'app/views/pages/game/trustTaskQuestionnaire.html' , controller: 'postGameQuestionnaireCtrl', controllerAs: 'postGameQuestionnaireCtrl', activeTab: 'playGame'
        })
        .when('/tutorialPage', {
            templateUrl: 'app/views/pages/game/tutorialPage.html' , controller: 'tutorialPageCtrl', controllerAs: 'tutorialPage'
        })
        .when('/practicePage', {
            templateUrl: 'app/views/pages/game/game.html' ,  controller: 'gamePageCtrl', controllerAs: 'gameData'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});