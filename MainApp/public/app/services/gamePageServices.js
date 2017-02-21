angular.module('gamePageServices', ['roomServices'])
    .factory('PatientService', function ($http, Room) {

    	gamePageFactory = {};
    	let roomSelector = "div[class='panel-body fixed-panel center']";
    	let map = new Map();
    	let patientMap = new Map();
        let roomMap = new Map();

        // Initial variables for Room
        let roomData = {};
        roomData.nDoctors = 0;
        roomData.nSurgeons = 0;
        roomData.nNurses = 0;
        roomData.patientType = null;
        roomData.timeLeft = 0;
        roomData.timeStarted = 0;
        roomData.collect = false;

        // Create room instances
        let roomIds = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];
        let divIds = ['div1', 'div2', 'div3', 'div4', 'div5', 'div6'];

        for (var i = 0, len = roomIds.length; i < len; i++) {
            roomMap.set(roomIds[i], new Room(roomIds[i], roomData));
            map.set(divIds[i], "green");
            patientMap.set(divIds[i], null);
        }

        gamePageFactory.create = function(userStatsData) {

        	return $http.post('/api/userStatistics', userStatsData);

        }

    	gamePageFactory.disableClick = function() {
    		//alert('disbaled')
     		$(roomSelector).off('click');
     		$(roomSelector).css("background", "");	
    	}

    	gamePageFactory.updateRoomInfo = function(resourceId) {
            // Updates the text in the clicked room panel
    		$("div[class='panel panel-success'] " + roomSelector).bind('click', function (e) {
                e.preventDefault();

                let myroomid = event.target.id;
                let key = myroomid.replace("R", "div");

                if (resourceId === 'btnDoctor') {
                    roomMap.get(myroomid).nDoctors = 1;
                    $("#"+ myroomid + " span[id='nDoctors']").text(roomMap.get(myroomid).nDoctors);
                } else if (resourceId === 'btnSurgeon') {
                    roomMap.get(myroomid).nSurgeons = 1;
                    $("#"+ myroomid + " span[id='nSurgeons']").text(roomMap.get(myroomid).nSurgeons);
                } else if (resourceId === 'btnNurse') {
                    roomMap.get(myroomid).nNurses = 1;
                    $("#"+ myroomid + " span[id='nNurses']").text(roomMap.get(myroomid).nNurses);
                }
                else if (resourceId === 'btnA') {
                    roomMap.get(myroomid).patientType = 'Patient A';
                    $("#"+ myroomid + " span[id='assignedPatient']").text(roomMap.get(myroomid).patientType);
                    $('#'+ key).removeClass().addClass('panel panel-danger');
                    map.set(key, 'red');
                    patientMap.set(key, 'patientA');
                } else if(resourceId == 'btnB') {
                    roomMap.get(myroomid).patientType = 'Patient B'
                    $("#"+ myroomid + " span[id='assignedPatient']").text(roomMap.get(myroomid).patientType);
                    $('#'+ key).removeClass().addClass('panel panel-danger');
                    map.set(key, 'red');
                    patientMap.set(key, 'patientB');
                }

                let divid =  $(this).parent("div[class='panel panel-success']").attr("id");
                $('#'+divid).removeClass().addClass('panel panel-danger');

                map.set(divid, 'red')
                gamePageFactory.disableClick();
            });

    	}




    	gamePageFactory.assignRoom = function(patientType) {
    		//alert("printing id in service "+ patientType)

    		//console.log(patientType)
     		
     		//displaying colors
     		map.forEach(function(value, key) {
     			
     			console.log(key, value)
     			if(value == 'green') {
     				//change div panel to success
     				$('#' + key).removeClass().addClass('panel panel-success');
     				
     				var rId = key.replace("div", "R");
     				//make that room hoverable
     				$('#' + key).hover(function(){
        				$(this).css("background", "#D3D3D3");
   			 			},
    					function(){
        					$(this).css("background", "");
    					}
    				);


     				
     			} else if(value == 'red') {
     				//change div to red danger
     				$('#' + key).removeClass().addClass('panel panel-danger');
     				$('#' + key).hover(function(){
        				$(this).css("background", "");
   			 			},
    					function(){
        					$(this).css("background", "");
    					}
    				);
     			}         
            });


     		gamePageFactory.updateRoomInfo(patientType);

    	};


    	gamePageFactory.assignResource = function(resourceId) {
    		//alert("resource id in assignResource " + resourceId)
    			//console.log("Printing key value in assignResource")
    		   patientMap.forEach(function (value, key) {
   		
    		   		var bodyId = key.replace("div", "R");

    		   		var assignedPatient = $("#"+ bodyId + " span[id='assignedPatient']").text();
            		//console.log("Printing assignedPatient " + assignedPatient)
           
    		   		//console.log("printing bodyid " + bodyId)
    		   		//console.log(bodyId);
    		   		//var x = "nSurgeons";
    		   		//$("#"+ bodyId + " span[id='"+"#"+ x+"']").text('23423');
            		if((resourceId === 'btnDoctor' && value === 'patientA')) {

            			//check if there's already a doctor assigned
            			var doctorCount = $("#"+ bodyId + " span[id='nDoctors']").text();
            			if(doctorCount == 0) {

            				$('#' + bodyId).hover(function(){
        						$(this).css("background", "#D3D3D3");
   			 					},
    							function(){
        							$(this).css("background", "");
    							}
    						);

            				$('#' + key).removeClass().addClass('panel panel-success');
            			} else if(doctorCount == 1) {

            				$('#' + bodyId).hover(function(){
        						$(this).css("background", "");
   			 					},
    							function(){
        							$(this).css("background", "");
    							}
    						);
            				$('#' + key).removeClass().addClass('panel panel-danger');	
            			}
               			

            		} else if ( (resourceId === 'btnSurgeon') && (value === 'patientB')) {

            			//check if there's already a surgeon assigned
                		var surgeonCount = $("#"+ bodyId + " span[id='nSurgeons']").text();
            			if(surgeonCount == 0) {

            				$('#' + bodyId).hover(function(){
        						$(this).css("background", "#D3D3D3");
   			 					},
    							function(){
        							$(this).css("background", "");
    							}
    						);
            				$('#' + key).removeClass().addClass('panel panel-success');
            			} else if(surgeonCount == 1) {

            				$('#' + bodyId).hover(function(){
        						$(this).css("background", "");
   			 					},
    							function(){
        							$(this).css("background", "");
    							}
    						);
            				$('#' + key).removeClass().addClass('panel panel-danger');	
            			}



            		}


            		 else if(resourceId === 'btnNurse' && (assignedPatient != 'VACANT')) {


            			
            			console.log(assignedPatient)

            			console.log("In nurses")
            			//check if there's already a nurse assigned
            			var nurseCount = $("#"+ bodyId + " span[id='nNurses']").text();
            			console.log(nurseCount)
            			if(nurseCount == 0) {
            				$('#' + bodyId).hover(function(){
        						$(this).css("background", "#D3D3D3");
   			 					},
    							function(){
        							$(this).css("background", "");
    							}
    						);
            				$('#' + key).removeClass().addClass('panel panel-success');
            			} else {
            				$('#' + bodyId).hover(function(){
        						$(this).css("background", "");
   			 					},
    							function(){
        							$(this).css("background", "");
    							}
    						);
            				$('#' + key).removeClass().addClass('panel panel-danger');	
            			}
            		}



            		else {
            			
            			$('#' + key).removeClass().addClass('panel panel-danger');
            		}
               });
    		  console.log(resourceId);
              gamePageFactory.updateRoomInfo(resourceId);
    	}


    	return gamePageFactory;  

    });
