angular.module('userStatsServices', [])
    .factory('UserStats', function ($http) {
        UserStatsFactory = {};

        let userStatsData = {};

        UserStatsFactory.create = function (userId, gameConfigId, versionNum) {
            // Initialize UserStatistics Object
            userStatsData.username = userId;
            userStatsData.gameConfigId = gameConfigId;
            userStatsData.finalScore = 0;
            userStatsData.moves = [];
            userStatsData.versionNum = versionNum;
        };

        UserStatsFactory.getStats = function () {
            return userStatsData;
        };

        UserStatsFactory.addMove = function (moveInfo, mainTimeLeft, gameState) {
            let totalScore = gameState.score + gameState.otherScore;

            let data = {
                moveInfo: moveInfo,
                mainTimeLeft: mainTimeLeft,
                numberOfNurses: gameState.numberOfNurses,
                numberOfDoctors: gameState.numberOfDoctors,
                numberOfSurgeons: gameState.numberOfSurgeons,
                otherNumberOfNurses: gameState.otherNumberOfNurses,
                otherNumberOfDoctors: gameState.otherNumberOfDoctors,
                otherNumberOfSurgeons: gameState.otherNumberOfSurgeons,
                numberOfPatientAs: gameState.numberOfPatientAs,
                numberOfPatientBs: gameState.numberOfPatientBs,
                otherNumberOfPatientAs: gameState.otherNumberOfPatientAs,
                otherNumberOfPatientBs: gameState.otherNumberOfPatientBs,
                score: gameState.score,
                otherScore: gameState.otherScore,
                totalScore: totalScore
            };

            userStatsData.moves.push(data);

        };

        UserStatsFactory.updateScore = function (finalScore) {
            userStatsData.finalScore = finalScore;
        };

        UserStatsFactory.addRecord = function () {
            // Post request to server
            //return $http.post('/api/game/userStatistics', userStatsData);
            return $http.post('/api/game/updateUserStatistics', userStatsData);

        };

        UserStatsFactory.setPageLoadCount=function(pageLoadCount){
            userStatsData.timesGameLoaded=pageLoadCount;
        };

        return UserStatsFactory;
    });
