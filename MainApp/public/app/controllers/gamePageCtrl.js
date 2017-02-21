angular.module('gamePageControllers', ['roomServices'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout, PatientService, Room) {
        let app = this;
        let patientService = PatientService;

       
        let statsObject = {};
        statsObject.finalScore = 10;
        statsObject.username = "Syed";
        let moves = [];
        moves.push("Doctor to Room1");
        moves.push("Surgeon to Room2");
        moves.push("Nurse to Room3");
        statsObject.moves = moves;

        
        $("#patients").click(function () {

            console.log(statsObject);
            PatientService.create(statsObject);

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

        $scope.counter = "10:00";
        let seconds = 600;


        //Greeting user
        app.username = $routeParams.username;


        // TImer logic
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

        $('#btnA').click(function(e) {
            patientService.assignRoom(event.target.id)

        });

        $('#btnB').click(function(e) {
            patientService.assignRoom(event.target.id)
        });


        $('#btnDoctor').click(function () {
            patientService.assignResource(event.target.id)
        });


        $('#btnSurgeon').click(function() {
            patientService.assignResource(event.target.id);
        });


         $('#btnNurse').click(function () {
            patientService.assignResource(event.target.id)
        });
        
      
        /*


        

        



        

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
            // if(typeof patientType == 'undefined') {
            //     alert("Cannot assign Nurses, assign patient first")
            // } else {
                patientMap.forEach(function (value, key) {
                    if (value != null) {
                        $('#' + key).removeClass().addClass('panel panel-success');
                    }
                });
                assignResource(event.target.id)
            // }
        });

        function updateRoomInfo(resourceId) {
            $("div[class='panel panel-success'] " + roomSelector).bind('click', function (e) {
                e.preventDefault();

                let myroomid = event.target.id;
                let key = myroomid.replace("R", "div");
                console.log(resourceId)
                console.log(myroomid);

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
     

*/
});
