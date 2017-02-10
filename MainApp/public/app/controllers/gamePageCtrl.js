angular.module('gamePageControllers', ['timer'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout) {
		let app = this;
     	app.username = $routeParams.username;
     	
     	$scope.counter = "10:00";
     	let seconds = 600;

        let roomSelector = "div[class='panel-body fixed-panel center']";
     	let div1 = document.getElementById("R1");
    	let div2 = document.getElementById("R2");
    	let div3 = document.getElementById("R3");
    	let div4 = document.getElementById("R4");
    	let div5 = document.getElementById("R5");
    	let div6 = document.getElementById("R6");

    	let map = new Map();
    	let patientMap = new Map();

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

    	let patients = 0;
    	let doctors = 0;
    	let surgeons = 0;
    	let patientSelected;


  		$("#patients").click(function () {
  			$('#patientsgroup').show();
  			$('#patients').hide();
  			$('#resourcesGroup').hide();
  			$('#resources').show();

  		});

  		$('#resources').click(function () {
  			$('#resources').hide();
  			$('#resourcesGroup').show();
  			$('#patients').show();
  			$('#patientsgroup').hide();

  		})
        
        $('#requestResources').click(function () {
            $('#resources').show();
            $('#resourcesGroup').show();
            $('#patients').hide();
            $('#patientsgroup').hide();

        })

     	$('#btnA').click(function(e) {
     		assignRoom(event.target.id)

     	});

     	$('#btnB').click(function(event) {
    		assignRoom(event.target.id)
    	});

        $('#btnSurgeon').click(function() {

            //alert('1')
            patientMap.forEach(function (value, key) {


                if(value === 'patientB') {
                    //alert(key);
                    $('#' + key).removeClass().addClass('panel panel-success');
                } else {
                    $('#' + key).removeClass().addClass('panel panel-danger');
                }

            });
            assignResource(event.target.id);
        });

     	function disableClick() {
     		//alert('disbaled')
     		$(roomSelector).off('click');

     	}



        $('#btnDoctor').click(function () {
            patientMap.forEach(function (value, key) {
            if(value === 'patientA') {
                $('#' + key).removeClass().addClass('panel panel-success');
            } else {
                $('#' + key).removeClass().addClass('panel panel-danger');
            }
            });
            assignResource(event.target.id)
        });

        $('#btnNurse').click(function () {
            if(typeof patientType == 'undefined') {
                alert("Cannot assign Nurses, assign patient first")
            } else {
                alert("nurse can be assigned")
            }
        });

        function updateRoomInfo(resourceId) {
            $("div[class='panel panel-success'] " + roomSelector).bind('click', function (e) {
                e.preventDefault();

                let myroomid = event.target.id;
                let key = myroomid.replace("R", "div");
                console.log(resourceId)
                console.log(myroomid);

                if (resourceId === 'btnDoctor') {
                    $("#"+ myroomid + " span[id='nDoctors']").text('1');
                } else if (resourceId === 'btnSurgeon') {
                    $("#"+ myroomid + " span[id='nSurgeons']").text('1');
                    let divid =  $(this).parent("div[class='panel panel-success']").attr("id");
                    $('#'+divid).removeClass().addClass('panel panel-danger');
                    map.set(divid, 'red')
                } else if (resourceId === 'btnA') {
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
                disableClick();
            });
        }

        function assignResource(resourceId) {
            console.log(resourceId);
            updateRoomInfo(resourceId);
     	}

     	function assignRoom(patientType) {
     		//display available and non-available rooms

     		console.log(patientType)
     		
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
     		updateRoomInfo(patientType);
     	}
     

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

	    let mytimeout = $timeout($scope.onTimeout,1000);

});
