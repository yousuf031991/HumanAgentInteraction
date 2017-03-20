angular.module('userStatsServices', [])
    .factory('UserStats', function ($http) {
        UserStatsFactory = {};

        let userStatsData = {};

        UserStatsFactory.create = function (userId, gameConfigId) {
            // Initialize UserStatistics Object
            userStatsData.username = userId;
            userStatsData.gameConfigId = gameConfigId;
            userStatsData.finalScore = 0;
            userStatsData.moves = [];
        };

        UserStatsFactory.getStats = function () {
            return userStatsData;
        };

        UserStatsFactory.addMove = function (moveInfo, mainTimeLeft, gameState) {
            let totalScore = gameState.score + gameState.otherScore;
            let csvLine = moveInfo + ","
                + mainTimeLeft + ","
                + gameState.numberOfNurses + ","
                + gameState.numberOfDoctors + ","
                + gameState.numberOfSurgeons + ","
                + gameState.otherNumberOfNurses + ","
                + gameState.otherNumberOfDoctors + ","
                + gameState.otherNumberOfSurgeons + ","
                + gameState.numberOfPatientAs + ","
                + gameState.numberOfPatientBs + ","
                + gameState.otherNumberOfPatientAs + ","
                + gameState.otherNumberOfPatientBs + ","
                + gameState.score + ","
                + gameState.otherScore + ","
                + totalScore;

            userStatsData.moves.push(csvLine);
        };

        UserStatsFactory.addRecord = function () {
            // Post request to server
            return $http.post('/api/userStatistics', userStatsData);
        };

        return UserStatsFactory;
    });
