angular.module('gamePageControllers', ['timer'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout) {
		let app = this;
     	app.username = $routeParams.username;
     	
     	$scope.counter = "10:00";
     	let seconds = 600;

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
     		//alert("patient A");

     		//$.when(assignRoom(event.target.id)).then(disableClick());

     		assignRoom(event.target.id)

     	});

     	$('#btnB').click(function(event) {
    		assignRoom(event.target.id)
    		//alert("button B clicked")

    	});

        $('#btnSurgeon').click(function() {

            //alert('1')
            patientMap.forEach(function (value, key) {

                $("div[class='panel-body fixed-panel']")
                    .hover(  function() {
                                $(this).css('background-color', '#D3D3D3')
                            }, function() {
                                $(this).css('background-color', '')
                });


                if(value === 'patientB') {
                    //alert(key);
                    $('#' + key).removeClass().addClass('panel panel-success');

                } else {
                    $('#' + key).removeClass().addClass('panel panel-danger');
                }

            });

            
            $("div[class='panel panel-success'] div[class='panel-body fixed-panel']").bind('click', function (e) {
                
                e.preventDefault();
                //alert('right div cLicked for Surgeon')
                //alert(event.target.id);
                let roomid = event.target.id;
                
                $('#'+roomid).text('Patient B');
                $('#'+roomid).append('<br>1 Surgeon<br/>');
                $('#'+roomid).append('0 Nurse');

                let divid =  $(this).parent("div[class='panel panel-success']").attr("id");
                //alert("div is "+ $(this).parent("div[class='panel panel-success']").attr("id"))
                $('#'+divid).removeClass().addClass('panel panel-danger');
                //$('#'+key).removeClass().addClass('panel panel-danger');
                map.set(divid, 'red')

                    
                //map.set(key, 'red');
                //patientMap.set(key, 'patientA');

                disableClick();
                    
            });
        });

     	function disableClick() {
     		//alert('disbaled')
     		$("div[class='panel-body fixed-panel']").off('click');

            $("div[class='panel-body fixed-panel']")
                    .hover(  function() {
                                $(this).css('background-color', '')
                            }, function() {
                                $(this).css('background-color', '')
                    });

     	}


        $('#btnDoctor').click(function () {
           // alert('1')
            
            patientMap.forEach(function (value, key) {


               
                
                //alert('color is ')
                //alert(map.get(key))
                /*let color = $('#' + key).attr("class")
                alert('color is' + color)*/
                if(value === 'patientA') {
                //alert(key);
                    $('#' + key).removeClass().addClass('panel panel-success');
                     $("div[class='panel-body fixed-panel']")
                    .hover(  function() {
                                $(this).css('background-color', '#D3D3D3')
                            }, function() {
                                $(this).css('background-color', '')
                    });

                } else {
                    $('#' + key).removeClass().addClass('panel panel-danger');
                }
            });
            

            $("div[class='panel panel-success'] div[class='panel-body fixed-panel']").bind('click', function (e) {
                
                    e.preventDefault();
                    //alert('right div cLicked for Doctor')
                   // alert(event.target.id);
                    let roomid = event.target.id;
                    $('#'+roomid).text('Patient A');
                    $('#'+roomid).append('<br>1 Doctor<br/>');
                    $('#'+roomid).append('0 Nurse'); 

                    let divid =  $(this).parent("div[class='panel panel-success']").attr("id");

                    //alert("div is "+ $(this).parent("div[class='panel panel-success']").attr("id"))
                    $('#'+divid).removeClass().addClass('panel panel-danger');
                    //$('#'+key).removeClass().addClass('panel panel-danger');

                    map.set(divid, 'red')

                    
                    //map.set(key, 'red');
                    //patientMap.set(key, 'patientA');

                    disableClick();
            });




        });

                $('#btnNurse').click(function () {

                    $("div[class='panel-body fixed-panel']")
                    .hover(  function() {
                                $(this).css('background-color', '#D3D3D3')
                            }, function() {
                                $(this).css('background-color', '')
                    });

                    if(typeof patientType == 'undefined') {
                        alert("Cannot assign Nurses, assign patient first")
                    } else {
                        alert("nurse can be assigned")
                    }
                });


               



     	
     	function assignRoom(patientType) {
     		//display available and non-available rooms

     		console.log(patientType)
            patientSelected = patientType;
     		
     		//displaying colors
     		map.forEach(function(value, key) {
     			
     			console.log(key, value)
     			if(value == 'green') {
     				//change div panel to success
     				$('#' + key).removeClass().addClass('panel panel-success');
                    $("div[class='panel-body fixed-panel']")
                    .hover(  function() {
                                $(this).css('background-color', '#D3D3D3')
                            }, function() {
                                $(this).css('background-color', '')
                    });
     				
     			} else if(value == 'red') {
     				//change div to red danger
     				$('#' + key).removeClass().addClass('panel panel-danger');
     			}

            
            });
     		


     		
     		

            //rooms are clicked
     		$("div[class='panel-body fixed-panel']").bind('click', function (e) {
     			
     			e.preventDefault();
               // alert('CLicked')
     			//alert(event.target.id);
     			
                myroomid = event.target.id;

                let key = myroomid.replace("R", "div");
              //  console.log("Printing div:"+key)
              //  console.log("Printing R:"+myroomid)

                if(patientType == 'btnA') {
                        //assign patient to that room
                        $('#'+myroomid).text('Patient A');
                        $('#'+myroomid).append('<br>0 Doctor<br/>');
                        $('#'+myroomid).append('0 Nurse');
                        $('#'+key).removeClass().addClass('panel panel-danger');
                        map.set(key, 'red');
                        patientMap.set(key, 'patientA');

                } else if(patientType == 'btnB') {
                        $('#'+myroomid).text('Patient B');
                        $('#'+myroomid).append('<br>0 Surgeon<br/>');
                        $('#'+myroomid).append('0 Nurse');
                        $('#'+key).removeClass().addClass('panel panel-danger');
                        map.set(key, 'red');
                        patientMap.set(key, 'patientB');

                }

                disableClick();
     		});

         		

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



	    
	    

		// let countdownTimer = setInterval('secondPassed()', 1000);
});
