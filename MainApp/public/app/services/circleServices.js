angular.module('circleServices', [])
    .factory('Circle', function ($http) {
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
		function Circle(circleId) {
			// Public properties, assigned to the instance ('this')
			this.circleId = circleId;
		    this.visibility = 'invisible';
			
		}

        Circle.prototype.setVisibility = function(visibility) {
            //console.log("Setting visibility" + visibility)
            this.visibility = visibility;
        };

        Circle.prototype.getVisibility = function() {
            //console.log("Getting visibility" + this.visibility)
            return this.visibility;
        };

        Circle.prototype.setCircleColor = function(color, patientType) {
           // console.log("Setting circle color to" + color)
            /*if(patientType === 'A') {

                if(color === 'red') 
                    $("#P1 #patientA").append('<img src="assets/images/red.png" height = "30px" width="30px" >');
                else if(color == 'yellow') 
                 $("#P1 #patientA").append('<img src="assets/images/yellow.png" height = "30px" width="30px" >');
                else if(color == 'green') 
                 $("#P1 #patientA").append('<img src="assets/images/green.png" height = "30px" width="30px" >');
            
            } else if(patientType === 'B') {

                 if(color === 'red') 
                    $("#P1 #patientB").append('<img src="assets/images/red.png" height = "30px" width="30px" >');
                else if(color == 'yellow') 
                    $("#P1 #patientB").append('<img src="assets/images/yellow.png" height = "30px" width="30px" >');
                else if(color == 'green') 
                    $("#P1 #patientB").append('<img src="assets/images/green.png" height = "30px" width="30px" >');
            }
            */




        };

    	return Circle;  
    });