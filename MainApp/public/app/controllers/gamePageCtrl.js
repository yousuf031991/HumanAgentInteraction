angular.module('gamePageControllers', ['roomServices', 'circleServices'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout, PatientService, Room, Agent, Circle, GameState, UserStats) {
        let app = this;
        app.username = $routeParams.username;

        // let statsObject = {};
        // statsObject.finalScore = 10;
        // statsObject.username = "Syed";
        // let moves = [];
        // moves.push("Doctor to Room1");
        // moves.push("Surgeon to Room2");
        // moves.push("Nurse to Room3");
        // statsObject.moves = moves;

        //set initial values
        let patientACount = 1;

        (function startButton() {
            alert("The goal is to save as many patients as possible")
            // include tharun's timer here 

            PatientService.newPatient();

        })();

        for (let i = 0; i < patientACount; i++) {
            $("#P1 #patientA").append('<img src="assets/images/green.png" height = "30px" width="30px" >');
        }

        // Get active game config and initialize game state object
        let activeGameConfig = {};
        PatientService.getGameConfig().then(function (returnData) {
            if (returnData.data.success) {
                console.log(returnData.data.config);
                activeGameConfig = returnData.data.config;
                app.gameState = new GameState(activeGameConfig);
                UserStats.create(app.username, activeGameConfig._id);

                // Testing
                // UserStats.addMove("Doctor to Room1", $scope.counter, app.gameState);
                // UserStats.addMove("Doctor to Room2", $scope.counter, app.gameState);
                // UserStats.addRecord();
            } else {
                console.log("Failed");
                console.log(returnData.data);
            }
        });


        $("#patients").click(function () {
            resetMsg();
            $('#patientsgroup').show();
            $('#resources').show();
            $('#requestResources').show();

            $('#patients').hide();
            $('#resourcesGroup').hide();
            $('#requestGroup').hide();

        });

        $('#resources').click(function () {
            resetMsg();
            $('#resourcesGroup').show();
            $('#patients').show();
            $('#requestResources').show();

            $('#resources').hide();
            $('#requestGroup').hide();
            $('#patientsgroup').hide();

        });

        $('#requestResources').click(function () {
            resetMsg();
            $('#requestGroup').show();
            $('#resources').show();
            $('#patients').show();


            $('#requestResources').hide();
            $('#resourcesGroup').hide();
            $('#patientsgroup').hide();
        });


        $scope.counter = "10:00";
        let seconds = 600;

        // Timer logic
        $scope.onTimeout = function () {
            minutes = Math.round((seconds - 30) / 60),
                remainingSeconds = seconds % 60;

            if (remainingSeconds < 10) {
                remainingSeconds = "0" + remainingSeconds;
            }

            if (seconds == 0) {
                $scope.counter = "00:00";
                //console.log(seconds);
            } else {
                seconds--;
            }

            let x = minutes * 60 * 1000;
            let y = remainingSeconds * 1000;
            let totalMs = x + y;
            /*
             if(totalMs==0) {
             if(patient)
             }
             */

            PatientService.timeProgress(totalMs);
            /*
             setTimeout(function() {
             milliseconds = PatientService.newPatient(totalxy);

             //pass totalxy to cou
             }, 0);*/


            //  console.log(totalxy)

            $scope.counter = minutes + ":" + remainingSeconds;


            // $scope.counter++;
            mytimeout = $timeout($scope.onTimeout, 1000);
        }

        let mytimeout = $timeout($scope.onTimeout, 1000);


        function resetMsg() {
            app.errorMsg = false;
            app.successMsg = false;
        }

        $('#btnA').click(function (e) {
            //check if patientA is available in waiting room
            PatientService.assignRoom(event.target.id)

        });

        $('#btnB').click(function (e) {
            PatientService.assignRoom(event.target.id)
        });


        $('#btnDoctor').click(function () {
            PatientService.assignResource(event.target.id, app.gameState)
        });


        $('#btnSurgeon').click(function () {
            PatientService.assignResource(event.target.id, app.gameState);
        });


        $('#btnNurse').click(function () {
            PatientService.assignResource(event.target.id, app.gameState);
        });

        // Listener for the request resource buttons  
        $('#btnRequestDoctor').click(function () {
            // TODO: Get Cooperation Mode from active game config
            // TODO: Get player and agent resources
            resetMsg();
            let decision = Agent.fulfillRequestAlgorithm(0, 2, 'high');
            console.log(decision);
            if (decision) {
                app.successMsg = "Doctor Request is accepted by neighbouring hospital";
            } else {
                app.errorMsg = "Doctor Request is denied by neighbouring hospital";
            }

        });


        $('#btnRequestSurgeon').click(function () {
            resetMsg();
            let decision = Agent.fulfillRequestAlgorithm(2, 3, 'high');
            if (decision) {
                app.successMsg = "Surgeon Request is accepted by neighbouring hospital";
            } else {
                app.errorMsg = "Surgeon Request is denied by neighbouring hospital";
            }
        });


        $('#btnRequestNurse').click(function () {
            resetMsg();
            let decision = Agent.fulfillRequestAlgorithm(0, 2, 'high');
            if (decision) {
                app.successMsg = "Nurse Request is accepted by neighbouring hospital";
            } else {
                app.errorMsg = "NurseRequest is denied by neighbouring hospital";
            }
        });
    });
