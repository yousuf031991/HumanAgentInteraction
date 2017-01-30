angular.module('trialInfoApp', ['appRoutes', 'trialInfoControllers', 'trialInfoServices', 'ngAnimate']).config(function () {
    console.log('testing trialInfo app');
});

angular.module('userApp', ['appRoutes', 'adminControllers', 'adminServices', 'ngAnimate', 'trialInfoApp']).config(function () {
    //console.log('testing user app');
});


