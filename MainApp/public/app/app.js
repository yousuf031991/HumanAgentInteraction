angular.module('trialInfoApp', ['appRoutes', 'trialInfoControllers', 'trialInfoServices', 'ngAnimate']).config(function () {
    //console.log('testing trialInfo app');
});

angular.module('gameApp', ['appRoutes', 'gamePageControllers', 'gamePageServices', 'roomServices', 'agentServices', 'circleServices', 'gameStateServices', 'userStatsServices', 'ngAnimate']).config(function () {
    //console.log('testing game app');
});


angular.module('userApp', ['appRoutes', 'adminControllers', 'adminServices', 'homeControllers', 'authControllers',
    'authServices', 'ui.bootstrap', 'ngAnimate', 'trialInfoApp', 'gameConfigApp', 'gameApp', 'manageAdminApp',
    'questionnaireApp', 'reportingApp', 'exportApp','manageGameApp']).config(function () {

angular.module('gameConfigApp', ['appRoutes', 'gameConfigControllers', 'gameConfigServices', 'ngAnimate']).config(function () {
    /*console.log('testing game config app');*/
});

angular.module('manageAdminApp', ['appRoutes', 'manageAdminControllers', 'manageAdminServices', 'ngAnimate']).config(function () {
    /*console.log('testing manageAdmin app');*/
});

angular.module('reportingApp', ['appRoutes', 'reportControllers', 'reportServices', 'ngAnimate']).config(function () {
    /*console.log('testing reporting app');*/
});

angular.module('questionnaireApp', ['appRoutes', 'questionnaireServices', 'ngAnimate', 'preGameQuestionnaireControllers','postGameQuestionnaireControllers']).config(function () {
    /*console.log('testing manageAdmin app');*/
});

angular.module('exportApp', ['appRoutes', 'exportControllers', 'exportServices', 'ngAnimate']).config(function () {
    /*console.log('testing export app');*/
});
angular.module('manageGameApp', ['appRoutes', 'manageGameControllers', 'ngCookies', 'ngAnimate']).config(function () {
    /*console.log('testing manage game app');*/
});
