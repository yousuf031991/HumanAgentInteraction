angular.module('circleServices', [])
    .factory('Circle', function ($http) {
        /**
        * Constructor, with class name
        */
        function Circle(circleId) {
            // Public properties, assigned to the instance ('this')
            this.circleId = circleId;
            this.visibility = 'invisible';
            
        }

        Circle.prototype.setVisibility = function(visibility, patientType) {
            //console.log("Setting visibility" + visibility)
            this.visibility = visibility;
            if(visibility == 'visible') {
                if(patientType === 'A') {
                    $("#P1 #patientA").append('1');

                } else if(patientType === 'B') {
                     $("#P1 #patientB").append('1');
                }
            }

        };

        Circle.prototype.getVisibility = function() {
            //console.log("Getting visibility" + this.visibility)
            return this.visibility;
        };
        return Circle;  
    });