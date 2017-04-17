angular.module('gamePageControllers', ['roomServices', 'circleServices', 'refreshServices'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout, $location, $anchorScroll, $rootScope, $cookies, PatientService, Room, Agent, Circle, GameState, UserStats, Refresh) {
        let app = this;
        let blinkTimer;
        let blinkTimer2;
        Refresh.checkRefresh();
        app.username=$rootScope.username;
        (function startButton() {
            alert("The goal is to save as many patients as possible");

            // Get active game config and initialize game state object
            let activeGameConfig = {};
            let patientACount;
            let patientBCount;

            PatientService.getGameConfig().then(function (returnData) {
                console.log("In start button");
                if (returnData.data.success) {
                    // console.log(returnData.data.config);
                    activeGameConfig = returnData.data.config;
                    app.gameState = new GameState(activeGameConfig);

                    patientACount = activeGameConfig.startNumPatientAs;
                    patientBCount = activeGameConfig.startNumPatientBs;

                    // Start clock
                    timerClock();

                    // Initialize Side Bar with start number of patients specified in config file
                    initializeSideBarQueue(patientACount, patientBCount);

                    // Start patient queueing algorithm for player.
                    PatientService.newPatient(app.gameState);
                    PatientService.newPatientforNH(app.gameState);

                    // Initialize User Statistics Service, to record user moves.
                    UserStats.create(app.username, activeGameConfig._id);

                    // Start Agent resource sharing algorithm
                    Agent.NHShareResource(PatientService, app.gameState);

                    // Agent playing algorithm.
                    Agent.NHHelpPatient(8000, app.gameState, $scope.counter);
                    console.log("In start button- success")
                } else {
                    console.log("Failed to get configuration");
                    console.log(returnData.data);
                }
            });

            /*// Start patient queueing algorithm for player.
             PatientService.newPatient(patientACount, patientBCount);
             PatientService.newPatientforNH(otherNumberOfPatientBsCount, otherNumberOfPatientBsCount);
             */
        })();

        function initializeSideBarQueue(patientACount, patientBCount) {
            //alert("Number of patientACount and patientBCount in initialize" + patientACount + patientBCount)

            for (let i = 0; i < patientACount; i++) {
                $("#P1").find("#patientA").append('<img src="assets/images/green.png" height = "30px" width="30px" >');
            }

            for (let j = 0; j < patientBCount; j++) {
                $("#P1").find("#patientB").append('<img src="assets/images/green.png" height = "30px" width="30px" >');
            }

        }

        $("#patients").click(function () {
            resetMsg();
            $('#patientsgroup').show();
            $('#resources').show();
            $('#shareResources').show();

            $('#patients').hide();
            $('#resourcesGroup').hide();
            $('#requestGroup').hide();

        });

        $("#playerScore").on('change', function () {
            let count = 0;
            blinkTimer = setInterval(function () {

                if (count >= 5) {
                    console.log("Count: " + count);
                    $('#playerScoreDiv').css({'background': ''});
                    clearInterval(blinkTimer);
                }
                // console.log ("in set interval")
                $('#playerScoreDiv').toggleClass('backgroundRed');
                count++;
            }, 500);
        });

        $("#agentScore").on('change', function () {

            let count = 0;
            blinkTimer2 = setInterval(function () {

                if (count >= 5) {
                    $('#agentScoreDiv').css({'background': ''});
                    clearInterval(blinkTimer2);
                }
                // console.log ("in set interval")
                $('#agentScoreDiv').toggleClass('backgroundRed');
                count++;
            }, 500);
        });

        $('#resources').click(function () {
            resetMsg();
            $('#resourcesGroup').show();
            $('#patients').show();
            $('#shareResources').show();

            $('#resources').hide();
            $('#requestGroup').hide();
            $('#patientsgroup').hide();

        });

        $('#shareResources').click(function () {
            resetMsg();
            $('#requestGroup').show();
            $('#resources').show();
            $('#patients').show();


            $('#shareResources').hide();
            $('#resourcesGroup').hide();
            $('#patientsgroup').hide();
        });

        function timerClock() {
            // Building the timer from game config
            let seconds = app.gameState.startTime;
            let minutes = seconds / 60;
            let remainingSeconds = seconds % 60;
            $scope.counter = "" + minutes + ":" + remainingSeconds;

            // Timer logic
            $scope.onTimeout = function () {
                minutes = Math.round((seconds - 30) / 60);
                remainingSeconds = seconds % 60;

                if (remainingSeconds < 10) {
                    remainingSeconds = "0" + remainingSeconds;
                }
                seconds--;
                let x = minutes * 60 * 1000;
                let y = remainingSeconds * 1000;
                let totalMs = x + y;
                PatientService.timeProgress(totalMs);
                $scope.counter = minutes + ":" + remainingSeconds;
                mytimeout = $timeout($scope.onTimeout, 1000);
                if (seconds == 0) {
                    $scope.counter = "00:00";
                    console.log(seconds);

                    stopTimer(mytimeout);
                }
            };

            let mytimeout = $timeout($scope.onTimeout, 1000);
        }


        function stopTimer(mytimeout) {
            console.log("Time stopped");
            $timeout.cancel(mytimeout);
            UserStats.updateScore(app.gameState.score);
            UserStats.addRecord();
            showFinishedModal();
        }


        function showFinishedModal() {
            $("#gameFinishedModal").modal("show");
            console.log("Shown");
            gameFinished();
        }

        function gameFinished() {
             $("#gFMclose").bind("click", function() {
             $("#gameFinishedModal").modal("hide")
             $timeout(function(){
                
                var data={
                    lastStageCompleted:$rootScope.GAMEPAGE
                }
                $rootScope.updateGameSession(data);
                $location.path('/trustAndTaskQuestionnaire');
                
             });
             console.log("hidden")
        });
        }
        function resetMsg() {
            app.errorMsg = false;
            app.successMsg = false;
        }

        $('#btnA').click(function (event) {
            //check if patientA is available in waiting room
            PatientService.assignRoom(event.target.id, app.gameState, UserStats)

        });

        $('#btnB').click(function (event) {
            PatientService.assignRoom(event.target.id, app.gameState, UserStats)
        });


        $('#btnDoctor').click(function (event) {
            PatientService.assignResource(event.target.id, app.gameState, $scope.counter, UserStats);
        });


        $('#btnSurgeon').click(function (event) {
            PatientService.assignResource(event.target.id, app.gameState, $scope.counter, UserStats);
        });


        $('#btnNurse').click(function (event) {
            PatientService.assignResource(event.target.id, app.gameState, $scope.counter, UserStats);
            //console.log(UserStats.getStats());
        });

        // Listener for the request resource buttons  
        $('#btnShareDoctor').click(function () {
            // resetMsg();

            /*let decision = Agent.fulfillRequestAlgorithm(0, 2, 'high');
             //console.log(decision);
             if (decision) {
             app.successMsg = "Doctor Request is accepted by neighbouring hospital";
             UserStats.addMove("AgentResponse, Accept", $scope.counter, app.gameState);
             } else {
             app.errorMsg = "Doctor Request is denied by neighbouring hospital";
             UserStats.addMove("AgentResponse, Deny", $scope.counter, app.gameState);
             }*/

            UserStats.addMove("PlayerShared, Doctor", $scope.counter, app.gameState);

            if (app.gameState.numberOfDoctors > 0) {
                app.gameState.numberOfDoctors -= 1;
                app.gameState.otherNumberOfDoctors += 1;
                UserStats.addMove("DoctorShared, Success", $scope.counter, app.gameState);
                app.successMsg = "Doctor is shared with neighbouring hospital";
                $location.hash('notify');
                $anchorScroll();

            } else {
                $("#notifyModalTitle").text("Error");
                $("#notifyModalbody").text("There are no doctors to share.");
                $("#notifyModal").modal("show");
                UserStats.addMove("DoctorShared, Failure", $scope.counter, app.gameState);
            }


        });


        $('#btnShareSurgeon').click(function () {
            /* resetMsg();
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
             $anchorScroll();*/

            UserStats.addMove("PlayerShared, Surgeon", $scope.counter, app.gameState);

            if (app.gameState.numberOfSurgeons > 0) {
                app.gameState.numberOfSurgeons -= 1;
                app.gameState.otherNumberOfSurgeons += 1;
                app.successMsg = "Surgeon is shared with neighbouring hospital";
                UserStats.addMove("SurgeonShared, Success", $scope.counter, app.gameState);
                $location.hash('notify');
                $anchorScroll();
            } else {
                //show a modal
                $("#notifyModalTitle").text("Error");
                $("#notifyModalbody").text("There are no surgeons to share.");
                $("#notifyModal").modal("show");
                UserStats.addMove("SurgeonShared, Failure", $scope.counter, app.gameState);
            }

        });


        $('#btnShareNurse').click(function () {
            /* resetMsg();
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
             */

            UserStats.addMove("PlayerShared, Nurse", $scope.counter, app.gameState);
            if (app.gameState.numberOfNurses > 0) {
                app.gameState.numberOfNurses -= 1;
                app.gameState.otherNumberOfNurses += 1;
                app.successMsg = "Nurse is shared with neighbouring hospital";
                UserStats.addMove("NurseShared, Success", $scope.counter, app.gameState);
                $location.hash('notify');
                $anchorScroll();
            } else {
                //show modal popup
                $("#notifyModalTitle").text("Error");
                $("#notifyModalbody").text("There are no nurses to share.");
                $("#notifyModal").modal("show");
                UserStats.addMove("NurseShared, Failure", $scope.counter, app.gameState);
            }

        });

    });