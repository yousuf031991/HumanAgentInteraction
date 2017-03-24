angular.module('gamePageControllers', ['roomServices', 'circleServices'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout, $location, $anchorScroll, $rootScope,$cookies, PatientService, Room, Agent, Circle, GameState, UserStats) {
        let app = this;
        app.username = $routeParams.username;
        var blinkTimer;

        // let statsObject = {};
        // statsObject.finalScore = 10;
        // statsObject.username = "Syed";
        // let moves = [];
        // moves.push("Doctor to Room1");
        // moves.push("Surgeon to Room2");
        // moves.push("Nurse to Room3");
        // statsObject.moves = moves;


        (function startButton() {
            alert("The goal is to save as many patients as possible");
            // include tharun's timer here 

            // Get active game config and initialize game state object
            let activeGameConfig = {};
            let patientACount;
            let patientBCount;
            let otherNumberOfPatientAsCount;
            let otherNumberOfPatientBsCount;
            PatientService.getGameConfig().then(function (returnData) {
                if (returnData.data.success) {
                   // console.log(returnData.data.config);
                    activeGameConfig = returnData.data.config;
                    app.gameState = new GameState(activeGameConfig);

                    patientACount = activeGameConfig.startNumPatientAs;
                    patientBCount = activeGameConfig.startNumPatientBs;
                    otherNumberOfPatientAsCount = activeGameConfig.NHstartNumPatientAs;
                    otherNumberOfPatientBsCount = activeGameConfig.NHstartNumPatientBs; 

                    // Initialize Side Bar with start number of patients specified in config file
                    initializeSideBarQueue(patientACount, patientBCount);

                    // Start patient queueing algorithm for player.
                    PatientService.newPatient(patientACount, patientBCount);
                    PatientService.newPatientforNH(otherNumberOfPatientBsCount, otherNumberOfPatientBsCount);

                    // Initialize User Statistics Service, to record user moves.
                    UserStats.create(app.username, activeGameConfig._id);

                    // TODO: Start patient queueing algorithm for agent.
                    Agent.NHHelpPatient(8000, app.gameState, $scope.counter);
                } else {
                    //console.log("Failed");
                   // console.log(returnData.data);
                }
            });

            /*// Start patient queueing algorithm for player.
            PatientService.newPatient(patientACount, patientBCount);
            PatientService.newPatientforNH(otherNumberOfPatientBsCount, otherNumberOfPatientBsCount);
*/
        })();

        function initializeSideBarQueue(patientACount, patientBCount) {
             //alert("Number of patientACount and patientBCount in initialize" + patientACount + patientBCount)

            for (let i = 0; i<patientACount; i++) {
                $("#P1").find("#patientA").append('<img src="assets/images/green.png" height = "30px" width="30px" >');
            }

            for(let j=0;j<patientBCount;j++) {
                $("#P1").find("#patientB").append('<img src="assets/images/green.png" height = "30px" width="30px" >');
            }

        }

        $("#patients").click(function () {
            resetMsg();
            $('#patientsgroup').show();
            $('#resources').show();
            $('#requestResources').show();

            $('#patients').hide();
            $('#resourcesGroup').hide();
            $('#requestGroup').hide();

        });

        $("#playerScore").on('change', function() {

            var count = 0;
            blinkTimer = setInterval(function() {

                 if(count == 5) {
                    $('#scoreDiv').css({'background':''});
                    clearInterval(blinkTimer);
                }
               // console.log ("in set interval")
                $('#scoreDiv').toggleClass('backgroundRed');
                count++;
            }, 500);
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
            let minutes = Math.round((seconds - 30) / 60),
                remainingSeconds = seconds % 60;

            if (remainingSeconds < 10) {
                remainingSeconds = "0" + remainingSeconds;
            }

            if (seconds == 0) {
                $scope.counter = "00:00";
                //console.log(seconds);

                var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
                gameSession.lastStageCompleted=$rootScope.GAMEPAGE;
                $cookies.putObject($rootScope.COOKIE_NAME,gameSession,$rootScope.getCookieOptions());
                $location.path('/trustAndTaskQuestionnaire');


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
        };

        let mytimeout = $timeout($scope.onTimeout, 1000);


        function resetMsg() {
            app.errorMsg = false;
            app.successMsg = false;
        }

        $('#btnA').click(function () {
            //check if patientA is available in waiting room
            PatientService.assignRoom(event.target.id)

        });

        $('#btnB').click(function () {
            PatientService.assignRoom(event.target.id)
        });


        $('#btnDoctor').click(function () {
            PatientService.assignResource(event.target.id, app.gameState, $scope.counter, UserStats);
        });


        $('#btnSurgeon').click(function () {
            PatientService.assignResource(event.target.id, app.gameState, $scope.counter, UserStats);
        });


        $('#btnNurse').click(function () {
            PatientService.assignResource(event.target.id, app.gameState, $scope.counter, UserStats);
            //console.log(UserStats.getStats());
        });

        // Listener for the request resource buttons  
        $('#btnRequestDoctor').click(function () {
            // TODO: Get Cooperation Mode from active game config
            // TODO: Get player and agent resources
            resetMsg();
            UserStats.addMove("PlayerRequest, Doctor", $scope.counter, app.gameState);
            let decision = Agent.fulfillRequestAlgorithm(0, 2, 'high');
            //console.log(decision);
            if (decision) {
                app.successMsg = "Doctor Request is accepted by neighbouring hospital";
                UserStats.addMove("AgentResponse, Accept", $scope.counter, app.gameState);
            } else {
                app.errorMsg = "Doctor Request is denied by neighbouring hospital";
                UserStats.addMove("AgentResponse, Deny", $scope.counter, app.gameState);
            }
            $location.hash('notify');
            $anchorScroll();
        });


        $('#btnRequestSurgeon').click(function () {
            resetMsg();
            UserStats.addMove("PlayerRequest, Surgeon", $scope.counter, app.gameState);
            let decision = Agent.fulfillRequestAlgorithm(2, 3, 'high');
            if (decision) {
                app.successMsg = "Surgeon Request is accepted by neighbouring hospital";
                UserStats.addMove("AgentResponse, Accept", $scope.counter, app.gameState);
            } else {
                app.errorMsg = "Surgeon Request is denied by neighbouring hospital";
                UserStats.addMove("AgentResponse, Deny", $scope.counter, app.gameState);
            }
            $location.hash('notify');
            $anchorScroll();
        });


        $('#btnRequestNurse').click(function () {
            resetMsg();
            UserStats.addMove("PlayerRequest, Nurse", $scope.counter, app.gameState);
            let decision = Agent.fulfillRequestAlgorithm(0, 2, 'high');
            $location.hash('notify');
            $anchorScroll();
            if (decision) {
                app.successMsg = "Nurse Request is accepted by neighbouring hospital";
                UserStats.addMove("AgentResponse, Accept", $scope.counter, app.gameState);
            } else {
                app.errorMsg = "NurseRequest is denied by neighbouring hospital";
                UserStats.addMove("AgentResponse, Deny", $scope.counter, app.gameState);
            }

        });

    });
