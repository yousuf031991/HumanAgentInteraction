angular.module('gamePageControllers')
    .controller('tutorialPageCtrl', function($rootScope, $route, $timeout, $http, $location, $scope) {
        let app = this;
        app.username = $rootScope.username;
        var intro = introJs();
        $timeout(function() { $scope.startTour();},0);
        var options_before = {
        steps: [
            {
                element: '#step1',
                intro: 'Time left to finish the game.',
                position: 'bottom'
            },
            {
                element: '#step2',
                intro: "Incoming patients view.",
                position: 'top'
            },
            {
                element: '#step3',
                intro: "Panel for assigning patients and resources to a room. You need to assign a patient to room first before assigning resources. Patient A: 1 doctor, 1 nurse. Patient B: 1 nurse. 1 surgeon.",
                position: 'top'
            },
            {
            	element: '#step4',
                intro: "Neighbouring hospital agent's patients view",
                position: 'top'
            },
            {
            	element: '#step5',
                intro: "Rooms marked red: Cannnot be assigned anything. Green: can be assigned",
                position: 'bottom'
            },
            {
            	element: '#step6',
                intro: "Your Resources left. Patients, Doctors, Surgeons.",
                position: 'top'
            },
            {
            	element: '#step7',
                intro: "Neighbours Resources left. Patients, Doctors, Surgeons.",
                position: 'top'
            },
            {
            	element: '#step8',
            	intro: "Hooray. You are done.",
                position: 'bottom'
            }

        ]
    };
     
    
    $scope.startTour =  function() {
    	
        intro.setOptions(options_before);
        intro.start();

        intro.onbeforechange(function () {

        	if (intro._currentStep+1 == "5") {
                $('#div1').removeClass().addClass('panel panel-danger');
 				$('#div2').removeClass().addClass('panel panel-danger');
 				$('#div3').removeClass().addClass('panel panel-danger');
 				$('#div4').removeClass().addClass('panel panel-success');
 				$('#div5').removeClass().addClass('panel panel-success');
 				$('#div6').removeClass().addClass('panel panel-success');
            } 

            if(intro._currentStep+1 == "1" || intro._currentStep+1 == "3") {
                    $("#P1").find("#patientA").text('');
                    $("#P1").find("#patientB").text('');
            }

            if(intro._currentStep+1 == "2") {

        		for (let i = 0; i<3; i++) {
                	$("#P1").find("#patientA").append('<img src="assets/images/red.png" height = "30px" width="30px" >');
        		}
        		for (let j = 0; j <3; j++) {
                	$("#P1").find("#patientB").append('<img src="assets/images/red.png" height = "30px" width="30px" >');
       	 		}

            }
        }).oncomplete(function() {
        	$timeout(function() {
                let data={
                            lastStageCompleted:$rootScope.TUTORIAL
                         }
                $rootScope.updateGameSession(data);
        		$location.path('/practicePage');
                //window.location.href = '/gamepage/' + app.username;
                //$route.reload();
        	});
        	
        });
        
        
         $('.introjs-skipbutton').hide();
    
        intro.onafterchange(function(){          
            if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
                $('.introjs-skipbutton').show();
            } 
        });
    };

   
     /*function startObjectsIntro() {
        var intro = introJs();
        intro.setOptions(options_before);
        intro.start().onbeforechange(function () {

            if (intro._currentStep == "2") {
                alert("This is step 2")
            } 
        });
    }
*/
       
       /* introJs().onchange(function(targetElement) {  
 			console.log(this._currentStep);

 			//panels demo
 			if(this._currentStep+1 == 5) {
 				console.log("complete panel to highlight")

 				$('#div1').removeClass().addClass('panel panel-danger');
 				$('#div2').removeClass().addClass('panel panel-danger');
 				$('#div3').removeClass().addClass('panel panel-danger');
 				$('#div4').removeClass().addClass('panel panel-success');
 				$('#div5').removeClass().addClass('panel panel-success');
 				$('#div6').removeClass().addClass('panel panel-success');


 			}



		}).start();
       */ 



    });