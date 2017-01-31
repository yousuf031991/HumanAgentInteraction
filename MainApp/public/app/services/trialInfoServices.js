angular.module('trialInfoServices', [])
    .factory('TrialInfo', function ($http) {
        trialInfoFactory = {};
        trialInfoFactory.create = function(trialInfoData){
            return $http.post('/api/trialinfo', trialInfoData);
        };
        return trialInfoFactory;
    });
