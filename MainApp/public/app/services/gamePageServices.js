angular.module('gamePageServices', ['roomServices', 'circleServices'])
    .factory('PatientService', function ($http, $timeout, Room, Circle) {

    	gamePageFactory = {};
    	let roomSelector = "div[class='panel-body fixed-panel center']";
    	let map = new Map();
    	let patientMap = new Map();
        let roomMap = new Map();
        var i = 0;
        var x = 0;

        // Initial variables for Room
        let roomData = {};
        roomData.nDoctors = 0;
        roomData.nSurgeons = 0;
        roomData.nNurses = 0;
        roomData.patientType = null;
        roomData.timeLeft = 0;
        roomData.timeStarted = 0;
        roomData.collect = false;

        var startTimeMilliseconds = 10;
        var practiceRound = false;
        var numPatientsForHighQuintuplet = 8;
        var numPatientsForMediumQuintuplet = 5;
        var numPatientsForLowQuintuplet = 2;
        var totalTimeLeftInMilliseconds;

        var patientACount = 1;
        var patientBCount = 0;
        var totalMissedPatients = 0;

        var highCooperation = true;
        var earlySlowPattern = true;

        // Create room instances
        let roomIds = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];
        let divIds = ['div1', 'div2', 'div3', 'div4', 'div5', 'div6'];

        for (var i = 0, len = roomIds.length; i < len; i++) {
            roomMap.set(roomIds[i], new Room(roomIds[i], roomData));
            map.set(divIds[i], "green");
            patientMap.set(divIds[i], null);
        }

       var circleA1 = new Circle('A1');
       var circleA2 = new Circle('A2');
       var circleA3 = new Circle('A3');
       var circleA4 = new Circle('A4');
       var circleA5 = new Circle('A5');
       var circleA6 = new Circle('A6');

       var circleB1 = new Circle('B1');
       var circleB2 = new Circle('B2');
       var circleB3 = new Circle('B3');
       var circleB4 = new Circle('B4');
       var circleB5 = new Circle('B5');
       var circleB6 = new Circle('B6');

        gamePageFactory.create = function(userStatsData) {

        	return $http.post('/api/userStatistics', userStatsData);

        }

        gamePageFactory.getGameConfig = function(){
            return $http.get('/api/getGameConfig');
        };

    	gamePageFactory.disableClick = function() {
    		//alert('disbaled')
     		$(roomSelector).off('click');
     		$(roomSelector).css("background", "");	
    	}

        gamePageFactory.updateSideBarMain = function() {

        //console.log('Updating side bar')
         /*   var docsCount = 0;
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
            });*/
            gamePageFactory.updatePatientsinSideBar();
        }

        gamePageFactory.updatePatientsinSideBar = function() {
            /*console.log("Number of Patients A and B")
            console.log(" A and B" + patientACount +" "+ patientBCount)*/
            circleA1.setVisibility('invisible')
            circleA2.setVisibility('invisible')
            circleA3.setVisibility('invisible')
            circleA4.setVisibility('invisible')
            circleA5.setVisibility('invisible')
            circleA6.setVisibility('invisible')

            circleB1.setVisibility('invisible')
            circleB2.setVisibility('invisible')
            circleB3.setVisibility('invisible')
            circleB4.setVisibility('invisible')
            circleB5.setVisibility('invisible')
            circleB6.setVisibility('invisible')

            switch(patientACount) {
                case 1:
                    circleA1.setVisibility('visible')
                    break;
                case 2:
                     circleA1.setVisibility('visible')
                     circleA2.setVisibility('visible')
                     break;
                case 3:
                     circleA1.setVisibility('visible')
                     circleA2.setVisibility('visible')
                     circleA3.setVisibility('visible')
                     break;
                case 4:
                     circleA1.setVisibility('visible')
                     circleA2.setVisibility('visible')
                     circleA3.setVisibility('visible')
                     circleA4.setVisibility('visible')
                     break;
                case 5:
                     circleA1.setVisibility('visible')
                     circleA2.setVisibility('visible')
                     circleA3.setVisibility('visible')
                     circleA4.setVisibility('visible')
                     circleA5.setVisibility('visible')
                     break;
                case 6:
                     circleA1.setVisibility('visible')
                     circleA2.setVisibility('visible')
                     circleA3.setVisibility('visible')
                     circleA4.setVisibility('visible')
                     circleA5.setVisibility('visible')
                     circleA6.setVisibility('visible')
                     break;
                default:
                    break;
            }


            switch(patientBCount) {
                case 1:
                    circleB1.setVisibility('visible')
                    break;
                case 2:
                     circleB1.setVisibility('visible')
                     circleB2.setVisibility('visible')
                     break;
                case 3:
                     circleB1.setVisibility('visible')
                     circleB2.setVisibility('visible')
                     circleB3.setVisibility('visible')
                     break;
                case 4:
                     circleB1.setVisibility('visible')
                     circleB2.setVisibility('visible')
                     circleB3.setVisibility('visible')
                     circleB4.setVisibility('visible')
                     break;
                case 5:
                     circleB1.setVisibility('visible')
                     circleB2.setVisibility('visible')
                     circleB3.setVisibility('visible')
                     circleB4.setVisibility('visible')
                     circleB5.setVisibility('visible')
                     break;
                case 6:
                     circleB1.setVisibility('visible')
                     circleB2.setVisibility('visible')
                     circleB3.setVisibility('visible')
                     circleB4.setVisibility('visible')
                     circleB5.setVisibility('visible')
                     circleB6.setVisibility('visible')
                     break;
                default:
                    break;
            }

            var total = patientACount + patientBCount
            if(total>=0 && total<=2) {
                gamePageFactory.setColor('green')
            } else if(total>2 && total<=4) {
                gamePageFactory.setColor('yellow')
            } else if(total>4 && total<=6) {
                gamePageFactory.setColor('red')
            }
        }
       
       gamePageFactory.setColor = function(color) {
           /* console.log("In setColor")
            console.log(circleA1)
            console.log(circleA2)
            console.log(circleA3)
            console.log(circleA4)
            console.log(circleA5)
            console.log(circleA6)

            console.log(circleB1)
            console.log(circleB2)
            console.log(circleB3)
            console.log(circleB4)
            console.log(circleB5)
            console.log(circleB6)*/            
            if(circleA1.getVisibility() === 'visible')
                circleA1.setCircleColor(color, 'A')
            if(circleA2.getVisibility() === 'visible')
                circleA2.setCircleColor(color, 'A')
            if(circleA3.getVisibility() === 'visible')
                circleA3.setCircleColor(color, 'A')
            if(circleA4.getVisibility() === 'visible')
                circleA4.setCircleColor(color, 'A')
            if(circleA5.getVisibility() === 'visible')
                circleA5.setCircleColor(color, 'A')
            if(circleA6.getVisibility() === 'visible')
                circleA6.setCircleColor(color, 'A')

            if(circleB1.getVisibility() === 'visible')
                circleB1.setCircleColor(color, 'B')
            if(circleB2.getVisibility() === 'visible')
                circleB2.setCircleColor(color, 'B')
            if(circleB3.getVisibility() === 'visible')
                circleB3.setCircleColor(color, 'B')
            if(circleB4.getVisibility() === 'visible')
                circleB4.setCircleColor(color, 'B')
            if(circleB5.getVisibility() === 'visible')
                circleB5.setCircleColor(color, 'B')
            if(circleB6.getVisibility() === 'visible')
                circleB6.setCircleColor(color, 'B')            

       }

       //thread that keeps on executing
       gamePageFactory.countdownTimer = function(totalMs) {

             //   console.log(totalMs)
                var patient = 1 + parseInt(Math.random() * ((1 - 0) + 1))
               // console.log("In totla")
               // console.log(patient)
                if(patient%2 == 0) {
                    if(patientACount+patientBCount<6) {
                        patientACount++;
                        //writeStringAsFile
                    } else {
                        totalMissedPatients++;
                        //writeStringAsFile
                    }
                    gamePageFactory.updateSideBarMain();
                    gamePageFactory.newPatient();


                }else if(patient%2 ==1) {
                    if(patientACount+patientBCount<6) {
                        patientBCount++;
                        //writeStringAsFile
                    } else {
                        totalMissedPatients++;
                        //writeStringAsFile
                    }
                    gamePageFactory.updateSideBarMain();
                    gamePageFactory.newPatient();
                }
            
       }

       gamePageFactory.newPatient = function(x) {
          
           var milliseconds;
            var quintupletTimeLeft = startTimeMilliseconds/5;
            totalTimeLeftInMilliseconds = x;
            i++;
            
            if(practiceRound) {
                quintupletTimeLeft = 480000/5;
                milliseconds = quintupletTimeLeft/numPatientsForMediumQuintuplet;
            } else {
                if(earlySlowPattern) {
                    switch(gamePageFactory.whichQuintupletTimeLeft()) {
                        case 1:
                        case 3:
                        case 5:
                        default:
                            milliseconds = quintupletTimeLeft/numPatientsForMediumQuintuplet;
                            break;
                        case 2:
                            milliseconds = quintupletTimeLeft/numPatientsForLowQuintuplet;
                            break;
                        case 4:
                            milliseconds = quintupletTimeLeft/numPatientsForHighQuintuplet;
                            break;
                    }
                }
            //console.log("Printing milliseconds " + milliseconds)
            }
       }

       gamePageFactory.whichQuintupletTimeLeft = function() {
            var quintupletTimeLeft = startTimeMilliseconds/5;
            if(totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft) //First Quintuplet
                return 1;

            if(totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft*2) //Second Quintuplet
                return 2;

            if(totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft*3) //Third Quintuplet
                return 3;

            if(totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft*4) //Fourth Quintuplet
                return 4;

            if(totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft*5) //Fifth Quintuplet
                return 5;

        return 1;


       }



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
        
            $("#rTimeoutmodal").modal("show")
            //alert("Time over. Collect resources")
            $("#" + roomId).text('');
            // introduce a collect resources button
            $("#" + roomId).append('<button onclick= "gamePageFactory.resetToVacantState(\'' + roomId +'\')" >Collect Resources</button>');

            //var modal = document.getElementById('mymodal');            
               /* $("#rTimeoutmodal").modal("show")
                $("#modalbody").append('<a id = "collect"></a>')
                 $('#modalbody #collect').text("Collect from "+roomId)
                $('#modalbody #collect').click(function() {
                 gamePageFactory.resetToVacantState(roomId);
            });
           */

           /* $("#rTimeoutmodal").modal("show");
            console.log($("#rTimeoutmodal").modal("show"));
             console.log($("#rTimeoutmodal").modal("hide"));

            $("#modalbody").append('<a id = "collect"></a>')
             $('#modalbody #collect').append("Collect from "+roomId)
            $('#modalbody #collect').click(function() {
                 gamePageFactory.resetToVacantState(roomId);
            });*/
           
                // add a modal pane as alert
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
              $("#rTimeoutmodal").modal("hide");
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

            // send the resources which are to be collected to gameState(Tharun)
            //[doctor, nurse, surgeon, patient type]
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
                   // gamePageFactory.showTimer();

                   // gamePageFactory.collectResource(key);
                    //$("#" + key + "span[id='timerForRoom']").show();
                    $("#" + key).append('<span id="timerForRoom">Timer started!</span>')
                   // $timeout(gamePageFactory.showTimer(), 1000);

                    gamePageFactory.showTimer(key);
                   //$scope.roomTimer = 0;
                   
                    value.collect = true;
                    


                } else if(value.patientType === 'Patient B' && value.nSurgeons === 1 && value.nNurses === 1 && value.collect === false) {
                    //alert("start the timer")
                    value.timeStarted = 60
                    $("#" + key).append('<span id="timerForRoom">Timer started!</span>')
                     gamePageFactory.showTimer(key);
                     value.collect = true
                }
            });
        }


        gamePageFactory.showTimer = function(key) {

        var seconds = 60;
        var rt = "01:00";
        var roomTimer = setInterval(function() {
            minutes = Math.round((seconds - 30)/60),
            remainingSeconds = seconds % 60;
  
            if (remainingSeconds < 10) {
                remainingSeconds = "0" + remainingSeconds;  
            }
                 
            if (minutes < 10) {
                minutes = "0" + minutes;  
            }

            if (seconds == 0) {
                rt = "00:00";
                console.log(rt)
                clearInterval(roomTimer);
                gamePageFactory.collectResource(key);

            } else {
                seconds--;
            }
            

            rt = minutes + ":" + remainingSeconds;
            $("#" + key + " #timerForRoom").text("Time left: " + rt);

            }, 1000);
  
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
