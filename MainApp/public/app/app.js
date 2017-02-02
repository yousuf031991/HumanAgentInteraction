angular.module('trialInfoApp', ['appRoutes', 'trialInfoControllers', 'trialInfoServices', 'ngAnimate']).config(function () {
    console.log('testing trialInfo app');
});

 angular.module('gameApp', ['appRoutes', 'gamePageControllers', 'ngAnimate']).config(function () {
     console.log('testing game app');
 });

angular.module('userApp', ['appRoutes', 'adminControllers', 'adminServices', 'ngAnimate', 'trialInfoApp', 'gameApp']).config(function () {
    //console.log('testing user app');
});



