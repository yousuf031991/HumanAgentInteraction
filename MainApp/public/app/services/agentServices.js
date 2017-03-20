angular.module('agentServices', [])
    .factory('Agent', function () {
    	let agentFactory = {};

    	agentFactory.fulfillRequestAlgorithm = function(currentResources, otherHospitalResources, cooperationType) {
    		/*
    		REFERENCE:
    		File	 : com.kle.hospitalmanagementgame/src/MainActivity.java
    		Function : fulfillRequestAlgorithm
    		*/

    		// If agent has no resources available, reject request
    		if (otherHospitalResources == 0) {
    			return false;
    		}

    		let total = currentResources + otherHospitalResources;

    		// If cooperation mode is high, agent fulfills request even when it has low resources
    		if(cooperationType === 'high') {
				if(total >= 0 && total <= 2) {
                    // Always fulfills request if total available resources between 0 and 2
                    return true;
				}
				if(total > 2 && total <= 4) {
					// Fulfills request 50 percent of the time, if available resources are between 2 and 4
					let rand = Math.floor((Math.random() * 2) + 1);
                    return rand == 0;
				} else {
					// Fulfills request 25 percent of the time, if available resources are above 4.
					let rand =  Math.floor((Math.random() * 4) + 1);
                    return rand == 0;
				}
			}
			// If cooperation mode is low, agent only fulfills request when the randomly generated number is 0.
			else {
				if(total >= 0 && total <= 2) {
                    // Fulfills request 50 percent of the time, if available resources are between 0 and 2
                    let rand = Math.floor((Math.random() * 2) + 1);
                    return rand == 0;
				} else if(total > 2 && total <= 4) {
                    // Fulfills request 25 percent of the time, if available resources are between 2 and 4
                    let rand = Math.floor((Math.random() * 4) + 1);
                    return rand == 0;
				} else {
					// Never fulfills request if total available resources > 4
					return false;
				}
			}
    	};

    	agentFactory.generateRandomNum = function(min, max) {
    		// Generates a random number between given min and max limits
			return Math.floor(Math.random()*(max-min+1)+min);
		};

    	agentFactory.NHCollectPatient = function(patientChoice) {
			// TODO: Add NH Collect Patient implementation
		};

    	agentFactory.interruptionRequest = function(resourceType) {
			// TODO: Add interrupt request implementation
		};

    	agentFactory.NHHelpPatient = function(milliseconds, gameState, currentTime) {
    		// Codes Used:
			// Nurses  :  1
			// Surgeon :  2
            setTimeout(function () {
				if (currentTime != "00:00") {
					let patientChoice;
					console.log('Inside NHHelpPatient');
					// If agent has both patient types in queue, pick at random
					// Else pick non zero patient type
					if (gameState.otherNumberOfPatientAs > 0 && gameState.otherNumberOfPatientBs > 0 && gameState.otherNumberOfRooms != 6) {
						patientChoice = agentFactory.generateRandomNum(0, 1);
					} else if (gameState.otherNumberOfPatientAs > 0) {
						patientChoice = 0;
					} else if (gameState.otherNumberOfPatientBs > 0) {
						patientChoice = 1;
					} else {
						patientChoice = 2;
					}
					console.log(gameState);
					console.log('Patient Choice' + patientChoice);
					// Patient Choice = A
					if (patientChoice == 0) {
						// Check if enough resources exists to treat chosen patient type, if so treat patient
						if (gameState.otherNumberOfDoctors > 0 && gameState.otherNumberOfNurses > 0) {
							gameState.otherNumberOfDoctors  -= 1;
							gameState.otherNumberOfNurses   -= 1;
							gameState.otherNumberOfPatientAs-= 1;
                            agentFactory.NHCollectPatient("A");
						}
						// Else, check if enough resources available to treat other patient type
						else if (gameState.otherNumberOfSurgeons > 0 && gameState.otherNumberOfNurses > 0 && gameState.otherNumberOfPatientBs > 0) {
                            gameState.otherNumberOfNurses   -= 1;
							gameState.otherNumberOfSurgeons -= 1;
                            gameState.otherNumberOfPatientBs-= 1;
                            agentFactory.NHCollectPatient("B");
                        } 
                        // If no patient type could be treated, make request to player
                        else {
							if (gameState.otherNumberOfDoctors == 0) {
								// Request couldn't be completed because of lack of doctors. So request doctors
                                // Doctor Code  :  0
                                agentFactory.interruptionRequest(0);
							} else {
								// Request couldn't be completed because of lack of nurses. So request nurses.
								// Nurse Code   :  1
								agentFactory.interruptionRequest(1);
							}
						}
					}
					// Patient Choice = B
					else if (patientChoice == 1) {
                        // Check if enough resources exists to treat chosen patient type, if so treat patient
                        if (gameState.otherNumberOfSurgeons > 0 && gameState.otherNumberOfNurses > 0) {
							gameState.otherNumberOfSurgeons -= 1;
							gameState.otherNumberOfNurses   -= 1;
							gameState.otherNumberOfPatientBs-= 1;
						}
                        // Else, check if enough resources available to treat other patient type
                        else if (gameState.otherNumberOfDoctors > 0 && gameState.otherNumberOfNurses > 0 && gameState.otherNumberOfPatientAs > 0) {
							gameState.otherNumberOfDoctors  -= 1;
							gameState.otherNumberOfNurses	-= 1;
							gameState.otherNumberOfPatientAs-= 1;
						}
                        // If no patient type could be treated, make request to player
                        else {
							if (gameState.otherNumberOfSurgeons == 0) {
                                // Request couldn't be completed because of lack of surgeons. So request doctors
                                // Surgeon Code  :  0
								agentFactory.interruptionRequest(2);
							} else {
                                // Request couldn't be completed because of lack of nurses. So request nurses.
                                // Nurse Code   :   1
                                agentFactory.interruptionRequest(1);
							}
						}
					}

				}
            }, milliseconds);
		};

    	return agentFactory;
    });