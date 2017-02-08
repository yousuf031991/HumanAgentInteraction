var secondPassed = function() {
	var seconds = 1500;
	var minutes = Math.round((seconds - 30)/60),
    remainingSeconds = seconds % 60;
  
	if (remainingSeconds < 10) {
	remainingSeconds = "0" + remainingSeconds;  
	}

	document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
		if (seconds == 0) {
			clearInterval(countdownTimer);
			document.getElementById('countdown').innerHTML = "00:00";
			console.log(seconds);
		} else {
			seconds--;
		}
}
angular.module('gamePageControllers', ['timer'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout) {
		var app = this;
     	app.username = $routeParams.username;
     	
     	$scope.counter = "10:00";
     	var seconds = 600;

	    $scope.onTimeout = function(){
	    	minutes = Math.round((seconds - 30)/60),
    		remainingSeconds = seconds % 60;
  
			if (remainingSeconds < 10) {
				remainingSeconds = "0" + remainingSeconds;  
			}

			if (seconds == 0) {
				$scope.counter = "00:00";
				console.log(seconds);
			} else {
				seconds--;
			}
			$scope.counter = minutes + ":" + remainingSeconds;


	        // $scope.counter++;
	        mytimeout = $timeout($scope.onTimeout,1000);
	    }

	    var mytimeout = $timeout($scope.onTimeout,1000);



	    
	    

		// var countdownTimer = setInterval('secondPassed()', 1000);
});
