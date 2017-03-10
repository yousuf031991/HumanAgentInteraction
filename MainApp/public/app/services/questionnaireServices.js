angular.module('questionnaireServices', [])
    .factory('QuestionnaireService', function ($http) {
        questionnaireFactory = {};
        questionnaireFactory.insertQuestionnaireResponse = function(questionnaireData){
            return $http.post('/api/game/updateUserStatistics', questionnaireData);
        };
        
        return questionnaireFactory;
    });