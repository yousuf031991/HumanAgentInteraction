angular.module('roomServices', [])
    .factory('Room', function ($http) {
    	// roomFactory = {};
    	// roomFactory.create = function(data) {
    	// 	this.finalScore = data.finalScore;
    	// 	console.log("Room Created: " + data.finalScore);
    	// 	// return $http.post('/api/userStatistics', data);
     //     };

     //    roomFactory.assign = function() {
     //        console.log("Assigning to the room");
     //    };
        /**
		* Constructor, with class name
		*/
		function Room(roomId, roomData) {
			// Public properties, assigned to the instance ('this')
			this.roomId = roomId;
			this.patientType = roomData.patientType;
			this.nDoctors = roomData.nDoctors;
			this.nNurses = roomData.nNurses;
			this.nSurgeons = roomData.nSurgeons;
			this.timeLeft = roomData.timeLeft;
			this.timeStarted = roomData.timeStarted;
			this.collect = roomData.collect;
			console.log("Initializing room");

			
		}



    	return Room;  
    });