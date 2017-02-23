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

       /* gamePageFactory.updateSideBar = function() {

            var docsCount = 0;
            var nursesCount = 0;
            var surgeonsCount = 0;

            roomMap.forEach(function(value,key) {
                docs = value.nDoctors; 
                if(value.nDoctors != 0) {
                    docsCount++;
                }
                if(value.nSurgeons != 0) {
                    surgeonsCount++;
                }
                if(value.nNurses != 0 ) {
                    nursesCount ++;
                }
            });
        }
       */
    	gamePageFactory.updateRoomInfo = function(resourceId) {
            // Updates the text in the clicked room panel
    		$("div[class='panel panel-success'] " + roomSelector).bind('click', function (e) {
                e.preventDefault();

                let myroomid = event.target.id;
                let __roomId = myroomid.replace("R", "div");

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
                    $('#'+ __roomId).removeClass().addClass('panel panel-danger');
                    map.set(__roomId, 'red');
                    patientMap.set(__roomId, 'patientA');
                    console.log("Printing doctors and nurses")

                    
                } else if(resourceId == 'btnB') {
                    roomMap.get(myroomid).patientType = 'Patient B';
                    $("#"+ myroomid + " span[id='assignedPatient']").text(roomMap.get(myroomid).patientType);
                    $('#'+ __roomId).removeClass().addClass('panel panel-danger');
                    map.set(__roomId, 'red');
                    patientMap.set(__roomId, 'patientB');

                }

                let divid =  $(this).parent("div[class='panel panel-success']").attr("id");
                $('#'+divid).removeClass().addClass('panel panel-danger');

                map.set(divid, 'red')
                gamePageFactory.disableClick();

                //Collecting resources
                gamePageFactory.isCollectible();
            });
    	}


         gamePageFactory.collectResource = function(roomId) {

            setTimeout(function () {
                    alert("Time over. Collect resources")
                    $("#" + roomId).text('');
                    // introduce a collect resources button
                    $("#" + roomId).append('<button onclick= "gamePageFactory.resetToVacantState(\'' + roomId +'\')" >Collect Resources</button> ');
                }, 60000);
        }

        gamePageFactory.resetToVacantState = function(roomId) {

              alert(roomId)
              var vacantDiv = $("#" + roomId);
              var vacantDiv = $('<div class="panel-body fixed-panel center" id="R1">'+      
              '<span id="assignedPatient">VACANT</span> <br/>'+
              '<span id="nDoctors">0</span> Doctors <br/>' +
              '<span id="nNurses">0</span> Nurses <br/>' +
              '<span id="nSurgeons">0</span> Surgeons <br/>' + 
              '</div>');

              $("#" + roomId).replaceWith(vacantDiv);
              gamePageFactory.resetToDefault(roomId);
        }

        gamePageFactory.resetToDefault = function(roomId) {

            divId = roomId.replace("R", "div");
            alert("in reset function")
            roomObject = roomMap.get(roomId);
            roomObject.nDoctors = 0;
            roomObject.nSurgeons = 0;
            roomObject.nNurses = 0;
            roomObject.patientType = null;
            roomObject.timeLeft = 0;
            roomObject.timeStarted = 0;
            roomObject.collect = false;
            roomMap.set(roomId, roomObject);
            patientMap.set(divId, null);
            map.set(divId, "green");
            console.log(roomObject)
        }

        gamePageFactory.isCollectible = function() {

           //iterate over map and collect resources
           roomMap.forEach(function(value, key) {
                if(value.patientType === 'Patient A' && value.nDoctors === 1 && value.nNurses === 1 && value.collect === false) {
                   
                    value.timeStarted = 60
                    gamePageFactory.collectResource(key);
                    value.collect = true;

                } else if(value.patientType === 'Patient B' && value.nSurgeons === 1 && value.nNurses === 1 && value.collect === false) {
                    //alert("start the timer")
                     value.timeStarted = 60
                     gamePageFactory.collectResource(key);
                     value.collect = true
                }
            });
        }

    	gamePageFactory.assignRoom = function(patientType) {

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
