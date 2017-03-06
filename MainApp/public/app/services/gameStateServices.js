angular.module('gameStateServices', [])
    .factory('GameState', function ($http) {
    	function GameState() {
			// Public properties, assigned to the instance ('this')
			this.numberOfPatientAs = 1;
			this.numberOfPatientBs = 0;
			this.numberOfDoctors = 2;
			this.numberOfNurses = 3;
			this.numberOfSurgeons = 2;
			this.otherNumberOfDoctors = 2;
			this.otherNumberOfNurses = 3;
			this.otherNumberOfSurgeons = 2;
			this.otherNumberOfPatientAs = 0;
			this.otherNumberOfPatientBs = 1;
			this.startTimeMilliseconds = 480000;
			this.patientTimeLeftMilliseconds = 60000;
			this.score = 0;
			this.otherScore = 0;
			console.log("Initializing game state");
		}
});