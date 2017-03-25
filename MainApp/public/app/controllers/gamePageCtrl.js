angular.module('gamePageControllers', ['roomServices', 'circleServices'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout, $location, $anchorScroll, PatientService, Room, Agent, Circle, GameState, UserStats) {
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

                    // Start clock
                    timerClock();

                    // Initialize Side Bar with start number of patients specified in config file
                    initializeSideBarQueue(patientACount, patientBCount);

                    // Start patient queueing algorithm for player.
                    PatientService.newPatient(patientACount, patientBCount);
                    PatientService.newPatientforNH(otherNumberOfPatientBsCount, otherNumberOfPatientBsCount);

                    // Initialize User Statistics Service, to record user moves.
                    UserStats.create(app.username, activeGameConfig._id);

                    // Start Agent resource sharing algorithm
                    Agent.NHShareResource(PatientService, app.gameState);

                    // Request resource algorithm. Not used.
                    // Agent.NHHelpPatient(8000, app.gameState, $scope.counter);
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
            $('#shareResources').show();

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

                if (seconds == 0) {
                    $scope.counter = "00:00";
                    //console.log(seconds);
                } else {
                    seconds--;
                }

                let x = minutes * 60 * 1000;
                let y = remainingSeconds * 1000;
                let totalMs = x + y;

                PatientService.timeProgress(totalMs);

                $scope.counter = minutes + ":" + remainingSeconds;


                // $scope.counter++;
                mytimeout = $timeout($scope.onTimeout, 1000);
            };

            let mytimeout = $timeout($scope.onTimeout, 1000);
        }

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
        $('#btnShareDoctor').click(function () {
            // TODO: Get Cooperation Mode from active game config
            // TODO: Get player and agent resources

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

            if(app.gameState.numberOfDoctors>0) {
                app.gameState.numberOfDoctors -= 1;
                app.gameState.otherNumberOfDoctors += 1;
                UserStats.addMove("DoctorShared, success", $scope.counter, app.gameState);
                app.successMsg = "Doctor is shared with neighbouring hospital";
                $location.hash('notify');
                $anchorScroll();

            } else {
                $("#errorModalbody").text("There are no doctors to share.");
                $("#errorModal").modal("show");
                UserStats.addMove("DoctorShared, failure", $scope.counter, app.gameState);
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

            if(app.gameState.numberOfSurgeons>0) {
                app.gameState.numberOfSurgeons -= 1;
                app.gameState.otherNumberOfSurgeons += 1;
                app.successMsg = "Surgeon is shared with neighbouring hospital";
                UserStats.addMove("SurgeonShared, success", $scope.counter, app.gameState);
                $location.hash('notify');
                $anchorScroll();
            } else {
                //show a modal
                 $("#errorModalbody").text("There are no surgeons to share.");
                 $("#errorModal").modal("show");
                 UserStats.addMove("SurgeonShared, failure", $scope.counter, app.gameState);
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
            if(app.gameState.numberOfNurses>0) {
                app.gameState.numberOfNurses -= 1;
                app.gameState.otherNumberOfNurses += 1;
                app.successMsg = "Nurse is shared with neighbouring hospital";
                UserStats.addMove("NurseShared, success", $scope.counter, app.gameState);
                $location.hash('notify');
                $anchorScroll();
            } else {
                //show modal popup
                $("#errorModalbody").text("There are no nurses to share.");
                $("#errorModal").modal("show");
                UserStats.addMove("NurseShared, failure", $scope.counter, app.gameState);
            }     

           
            

        });

    });
