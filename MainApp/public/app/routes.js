angular.module('appRoutes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'app/views/pages/home.html', controller: 'signInCtrl', controllerAs: 'signIn'
    })
        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })
        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })
        .when('/adminpage', {
            templateUrl: 'app/views/pages/admin/adminPage.html'
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
