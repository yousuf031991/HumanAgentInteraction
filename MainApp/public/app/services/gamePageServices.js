angular.module('gamePageServices', [])
    .factory('PatientService', function ($http) {

    	gamePageFactory = {};
    	let roomSelector = "div[class='panel-body fixed-panel center']";
    	let map = new Map();
    	let patientMap = new Map();

    	let div1 = document.getElementById("R1");
        let div2 = document.getElementById("R2");
        let div3 = document.getElementById("R3");
        let div4 = document.getElementById("R4");
        let div5 = document.getElementById("R5");
        let div6 = document.getElementById("R6");

    	map.set("div1", "green") 
        map.set("div2", "green")
        map.set("div3", "green")
        map.set("div4", "green")
        map.set("div5", "green")
        map.set("div6", "green")

        patientMap.set("div1", null) 
        patientMap.set("div2", null)
        patientMap.set("div3", null)
        patientMap.set("div4", null)
        patientMap.set("div5", null)
        patientMap.set("div6", null)

    	gamePageFactory.disableClick = function() {
    		//alert('disbaled')
     		$(roomSelector).off('click');
    	}

    	gamePageFactory.updateRoomInfo = function(resourceId) {
    		$("div[class='panel panel-success'] " + roomSelector).bind('click', function (e) {
                e.preventDefault();

                let myroomid = event.target.id;
                let key = myroomid.replace("R", "div");
                //console.log(resourceId)
                //console.log(myroomid);
               // alert("Printing myroomid" + myroomid)

                if (resourceId === 'btnDoctor') {
                    // TODO: Perform check to see if resource has been already set to room
                    $("#"+ myroomid + " span[id='nDoctors']").text('1');
                } else if (resourceId === 'btnSurgeon') {
                    $("#"+ myroomid + " span[id='nSurgeons']").text('1');
                    // let divid =  $(this).parent("div[class='panel panel-success']").attr("id");
                    // $('#'+divid).removeClass().addClass('panel panel-danger');
                    // map.set(divid, 'red')
                } else if (resourceId === 'btnNurse') {
                    $("#"+ myroomid + " span[id='nNurses']").text('1');
                }
                else if (resourceId === 'btnA') {
                    $("#"+ myroomid + " span[id='assignedPatient']").text('Patient A');
                    $('#'+ key).removeClass().addClass('panel panel-danger');
                    map.set(key, 'red');
                    patientMap.set(key, 'patientA');
                } else if(resourceId == 'btnB') {
                    $("#"+ myroomid + " span[id='assignedPatient']").text('Patient B');
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
     				
     			} else if(value == 'red') {
     				//change div to red danger
     				$('#' + key).removeClass().addClass('panel panel-danger');
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
            				$('#' + key).removeClass().addClass('panel panel-success');
            			} else if(doctorCount == 1) {
            				$('#' + key).removeClass().addClass('panel panel-danger');	
            			}
               			

            		} else if ( (resourceId === 'btnSurgeon') && (value === 'patientB')) {

            			//check if there's already a surgeon assigned
                		var surgeonCount = $("#"+ bodyId + " span[id='nSurgeons']").text();
            			if(surgeonCount == 0) {
            				$('#' + key).removeClass().addClass('panel panel-success');
            			} else if(surgeonCount == 1) {
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
            				$('#' + key).removeClass().addClass('panel panel-success');
            			} else {
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
