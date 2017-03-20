angular.module('gameStateServices', [])
    .factory('GameState', function () {
    	function GameState(gameData) {
			// Public properties, assigned to the instance ('this')
			this.numberOfPatientAs 			= gameData.startNumPatientAs;
			this.numberOfPatientBs 			= gameData.startNumPatientBs;
			this.numberOfDoctors 			= gameData.numOfDoctors;
			this.numberOfNurses 			= gameData.numOfNurses;
			this.numberOfSurgeons 			= gameData.numOfSurgeons;
			this.otherNumberOfDoctors 		= gameData.NHnumOfDoctors;
			this.otherNumberOfNurses 		= gameData.NHnumOfNurses;
			this.otherNumberOfSurgeons		= gameData.NHnumOfSurgeons;
			this.otherNumberOfPatientAs 	= gameData.NHstartNumPatientAs;
			this.otherNumberOfPatientBs 	= gameData.NHstartNumPatientAs;
			this.startTime 					= gameData.totalTimeInSeconds;
            this.patientTimeLeft 			= gameData.patientHelpTimeInSeconds;
            this.score = 0;
			this.otherScore = 0;
			console.log("Initializing game state");
		}
	return GameState;
});