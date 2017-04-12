angular.module('trialInfoApp', ['appRoutes', 'trialInfoControllers', 'trialInfoServices', 'ngAnimate']).config(function () {
    //console.log('testing trialInfo app');
});

angular.module('gameApp', ['appRoutes', 'gamePageControllers', 'gamePageServices', 'roomServices', 'agentServices', 'circleServices', 'gameStateServices', 'userStatsServices', 'ngAnimate']).config(function () {
    //console.log('testing game app');
});


let userApp=angular.module('userApp', ['appRoutes','refreshServices', 'adminControllers', 'adminServices', 'homeControllers', 'authControllers',
    'authServices', 'ui.bootstrap', 'ngAnimate','ngCookies', 'trialInfoApp', 'gameConfigApp', 'gameApp', 'manageAdminApp',
    'questionnaireApp', 'reportingApp', 'exportApp', 'scrollingServices','globalServices']).config(function () {
//console.log("Testing User app");
});

userApp.run(function(Global){
	Global.setGlobals();
});


angular.module('gameConfigApp', ['appRoutes', 'gameConfigControllers', 'gameConfigServices', 'ngAnimate']).config(function () {
    /*console.log('testing game config app');*/
});

angular.module('manageAdminApp', ['appRoutes', 'manageAdminControllers', 'manageAdminServices', 'ngAnimate']).config(function () {
    /*console.log('testing manageAdmin app');*/
});

angular.module('reportingApp', ['appRoutes', 'reportControllers', 'reportServices', 'ngAnimate']).config(function () {
    /*console.log('testing reporting app');*/
});

angular.module('questionnaireApp', ['appRoutes', 'questionnaireServices','ngAnimate', 'preGameQuestionnaireControllers','postGameQuestionnaireControllers']).config(function () {
    /*console.log('testing manageAdmin app');*/
});

angular.module('exportApp', ['appRoutes', 'exportControllers', 'exportServices', 'ngAnimate']).config(function () {
    /*console.log('testing export app');*/
});
