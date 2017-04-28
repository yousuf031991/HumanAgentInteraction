angular.module('agentServices', [])
    .factory('Agent', function () {
    	let agentFactory = {};
        let collectTimer;
        let helpTimer;
        let shareTimer;

        agentFactory.clearTimers = function() {
            clearTimeout(collectTimer);
            clearTimeout(helpTimer);
            clearTimeout(shareTimer);
        };
    
    	// Algorithm for agent to accept or deny shared resource
    	agentFactory.decisionAlgorithm = function(cooperationType) {
            let randomDecision = agentFactory.generateRandomNum(0, 1);

            if (cooperationType === 'HIGH COOPERATION') {
                // In high cooperation, agent accepts shared resource only 60% of the time.
                if (randomDecision >= 0 && randomDecision <= 0.6) {
                    return true;
                } else {
                    return false;
                }
            } else {
                // In low cooperation, agent accepts shared resource only 30% of the time.
                if (randomDecision >= 0 && randomDecision <= 0.3) {
                    return true;
                } else {
                    return false;
                }
            }
		};

    	agentFactory.fulfillRequestAlgorithm = function(currentResources, otherHospitalResources, cooperationType) {
			/**
			* REFERENCE:
			* File	 : com.kle.hospitalmanagementgame/src/MainActivity.java
			* Function : fulfillRequestAlgorithm
			*/

			// If agent has no resources available, reject request
    		if (otherHospitalResources == 0) {
    			return false;
    		}

    		let total = currentResources + otherHospitalResources;

    		// If cooperation mode is high, agent fulfills request even when it has low resources
    		if(cooperationType === 'HIGH COOPERATION') {
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

        // Resource sharing algorithm for agent. Used instead of request resource algorithm
        agentFactory.NHShareResource = function(patientService, gameState, versionNum) {
        	let factor = 1;
        	if (gameState.cooperationMode == "LOW COOPERATION") {
				factor = 4;
			} else {
        		factor = 2;
			}
        	let totalAvailableResources = gameState.otherNumberOfDoctors + gameState.otherNumberOfNurses + gameState.otherNumberOfSurgeons;
        	if (totalAvailableResources > 0) {
                let shareWaitTime = 0;
                let quintupletTimeLeft = (gameState.startTime*1000) / 5;

                // Choosing wait time to share resources based on quintuple.
                // Shares at faster rate, when patients are coming faster and vice versa
				let quintupletNum = patientService.whichQuintupletTimeLeft();
                switch (quintupletNum) {
                    case 2:
                        shareWaitTime = factor * quintupletTimeLeft / gameState.numPatientsForLowQuintuplet;
                        break;
                    case 4:
                        shareWaitTime = factor * quintupletTimeLeft / gameState.numPatientsForHighQuintuplet;
                        break;
                    default:
                        shareWaitTime = factor * quintupletTimeLeft / gameState.numPatientsForMediumQuintuplet;
                        break;
                }
                // console.log("QuintupleNum: " + quintupletNum);
				shareWaitTime = Math.max(shareWaitTime, gameState.minShareWaitTime*1000);
                console.log("Sharing resource in " + shareWaitTime / 1000 + "seconds");
                agentFactory.NHShareResourceTimer(patientService, gameState, shareWaitTime, versionNum);
			}

		};

        // Timer function to share resources
    	agentFactory.NHShareResourceTimer = function(patientService, gameState, milliseconds, versionNum) {
			 shareTimer = setTimeout(function() {

				// Wait time before sharing is determined based on cooperation mode set
				// Step 1: Form an array of non-zero resources
				// Step 2: Select an available resource at random to share
				// Step 3: Share one resource of the randomly selected resource type to player

				let resources = [gameState.otherNumberOfDoctors, gameState.otherNumberOfNurses, gameState.otherNumberOfSurgeons];
				let resourceTag = ['D', 'N', 'S'];
				let availableResources = [];

				// Step 1
				for (let i = 0; i < 3; i++) {
					if (resources[i] > 0) {
						availableResources.push(resourceTag[i]);
					}
				}

				// Step 2
				let randomIdx = agentFactory.generateRandomNum(0, availableResources.length - 1);

				// Step 3
                // Update agent's available resource in game state
				// Update player's available resource in game state
                // Notify player that agent shared a resource
				if (versionNum == 1) {
                    $('#notifyModalTitle').text("Notification");
                    if (availableResources[randomIdx] == 'D') {
                        gameState.otherNumberOfDoctors -= 1;
                        gameState.numberOfDoctors  += 1;
                        $('#notifyModalbody').text("Agent has shared a doctor");
                    } else if (availableResources[randomIdx] == 'N') {
                        gameState.otherNumberOfNurses -= 1;
                        gameState.numberOfNurses   += 1;
                        $('#notifyModalbody').text("Agent has shared a nurse");
                    } else if (availableResources[randomIdx] == 'S') {
                        gameState.otherNumberOfSurgeons -= 1;
                        gameState.numberOfSurgeons += 1;
                        $('#notifyModalbody').text("Agent has shared a surgeon")
                    }

                    $('#notifyModal').modal("show");
				} else {
                    $('#shareResourceModalTitle').text("Notification");
                    if (availableResources[randomIdx] == 'D') {
                        $('#shareResourceModalBody').text("Agent has shared a doctor");
                        $('#shareResourceType').text("Doctor");
                    } else if (availableResources[randomIdx] == 'N') {
                        $('#shareResourceModalBody').text("Agent has shared a nurse");
                        $('#shareResourceType').text("Nurse");
                    } else if (availableResources[randomIdx] == 'S') {
                        $('#shareResourceModalBody').text("Agent has shared a surgeon");
                        $('#shareResourceType').text("Surgeon");
                    }
					$('#shareResourceModal').modal("show");
				}

                agentFactory.NHShareResource(patientService, gameState, versionNum);
			}, milliseconds);
		};

    	// Assign to room and collect after x time
        agentFactory.NHCollectPatient = function(patientChoice, gameState, patientHelpTimeInSeconds) {
			let treatmentTimeInMs = patientHelpTimeInSeconds*1000;
            collectTimer = setTimeout(function() {
                // Patient A
                if (patientChoice == "A") {
                    gameState.otherNumberOfDoctors  += 1;
                } else {
                    gameState.otherNumberOfSurgeons += 1;
                }

                gameState.otherNumberOfNurses += 1;
                gameState.otherScore          += 1;
                gameState.otherNumberOfRooms  -= 1;
                
				$("#agentScore").trigger('change');
            }, treatmentTimeInMs);

            gameState.otherNumberOfRooms += 1;
        };

    	// Agent playing algorithm
    	agentFactory.NHHelpPatient = function(milliseconds, gameState, currentTime) {
    		// Codes Used:
			// Nurses  :  1
			// Surgeon :  2
			// let treatmentSuccess = false;
            helpTimer = setTimeout(function () {
				if (currentTime != "00:00") {
					let patientChoice;
					//console.log('Inside NHHelpPatient');
					// If agent has both patient types in queue, pick at random
					// Else pick non zero patient type
					// console.log(gameState);
					if (gameState.otherNumberOfPatientAs > 0 && gameState.otherNumberOfPatientBs > 0 && gameState.otherNumberOfRooms != 0) {
						patientChoice = agentFactory.generateRandomNum(0, 1);
					} else if (gameState.otherNumberOfPatientAs > 0) {
						patientChoice = 0;
					} else if (gameState.otherNumberOfPatientBs > 0) {
						patientChoice = 1;
					} else {
						patientChoice = 2;
					}
					// console.log(gameState);
					// console.log('Patient Choice' + patientChoice);
					// Patient Choice = A
					if (patientChoice == 0) {
						// Check if enough resources exists to treat chosen patient type, if so treat patient
						if (gameState.otherNumberOfDoctors > 0 && gameState.otherNumberOfNurses > 0) {
							gameState.otherNumberOfDoctors  -= 1;
							gameState.otherNumberOfNurses   -= 1;
							gameState.otherNumberOfPatientAs-= 1;
                            // console.log("Calling collect. Patient Choice: "+ patientChoice);
                            agentFactory.NHCollectPatient("A", gameState, gameState.patientHelpTimeInSeconds);
						}
						// Else, check if enough resources available to treat other patient type
						else if (gameState.otherNumberOfSurgeons > 0 && gameState.otherNumberOfNurses > 0 && gameState.otherNumberOfPatientBs > 0) {
                            gameState.otherNumberOfNurses   -= 1;
							gameState.otherNumberOfSurgeons -= 1;
                            gameState.otherNumberOfPatientBs-= 1;
                            // console.log("Calling collect. Patient Choice: "+ patientChoice);
                            agentFactory.NHCollectPatient("B", gameState, gameState.patientHelpTimeInSeconds);
                        } 
                        // If no patient type could be treated, make request to player
						/* Added for future use.
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
                            treatmentSuccess = true;
                        }
                        */
					}
					// Patient Choice = B
					else if (patientChoice == 1) {
                        // Check if enough resources exists to treat chosen patient type, if so treat patient
                        if (gameState.otherNumberOfSurgeons > 0 && gameState.otherNumberOfNurses > 0) {
							gameState.otherNumberOfSurgeons -= 1;
							gameState.otherNumberOfNurses   -= 1;
							gameState.otherNumberOfPatientBs-= 1;
                            // console.log("Calling collect. Patient Choice: "+ patientChoice);
                            // TODO: Replace 6000 with patient help time in gamestate.
                            agentFactory.NHCollectPatient("B", gameState, gameState.patientHelpTimeInSeconds);

                        }
                        // Else, check if enough resources available to treat other patient type
                        else if (gameState.otherNumberOfDoctors > 0 && gameState.otherNumberOfNurses > 0 && gameState.otherNumberOfPatientAs > 0) {
							gameState.otherNumberOfDoctors  -= 1;
							gameState.otherNumberOfNurses	-= 1;
							gameState.otherNumberOfPatientAs-= 1;
                            // console.log("Calling collect. Patient Choice: "+ patientChoice);
                            agentFactory.NHCollectPatient("B", gameState, gameState.patientHelpTimeInSeconds);

                        }
                        // If no patient type could be treated, make request to player
						/* Added for future use
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
                            treatmentSuccess = true;
                        }
                        */

					}
					
					// if (treatmentSuccess)
					agentFactory.NHHelpPatient(milliseconds, gameState, currentTime);
					// console.log(patientChoice);
				}
            }, milliseconds);
		};

    	return agentFactory;
    });