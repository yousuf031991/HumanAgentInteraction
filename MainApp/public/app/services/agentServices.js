angular.module('agentServices', [])
    .factory('Agent', function ($http) {
    	agentFactory = {};

    	agentFactory.fulfillRequestAlgorithm = function(currentResources, otherHospitalResources, cooperationType) { 
    		if (otherHospitalResources === 0) {
    			return false;
    		}

    		let total = currentResources + otherHospitalResources;

    		if(cooperationType === 'high') {
				if(total >= 0 && total <= 2)
					return true;
				else if(total > 2 && total <= 4) {
					let rand = Math.floor((Math.random() * 2) + 1);
					if(rand == 0)
						return true;
					else
						return false;
				} else {
					let rand =  Math.floor((Math.random() * 4) + 1);
					if(rand == 0)
						return true;
					else
						return false;
				}
			} else {
				if(total >= 0 && total <= 2) {
					let rand = Math.floor((Math.random() * 2) + 1);
					if(rand == 0)
						return true;
					else
						return false;
				} else if(total > 2 && total <= 4) {
					let rand = Math.floor((Math.random() * 4) + 1);
					if(rand == 0)
						return true;
					else
						return false;
				} else {
					return false;
				}
			}
    	}

    	return agentFactory;
    });