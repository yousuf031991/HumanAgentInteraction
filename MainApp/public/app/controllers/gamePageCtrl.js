angular.module('gamePageControllers', ['roomServices', 'circleServices', 'refreshServices', 'scrollingServices'])
    .controller('gamePageCtrl', function ($scope, $http, $routeParams, $timeout, $location, $anchorScroll, $rootScope,
                            $cookies, PatientService, Room, Agent, Circle, GameState, UserStats, Refresh, Scrolling) {
        let app = this;
        let blinkTimer;
        let blinkTimer2;
        let versionNum = $rootScope.getGameVersion();
        console.log("Version: " + versionNum);
        if (versionNum == undefined) {
            versionNum = 1;
        }

        console.log("Version: " + versionNum);
        Refresh.checkRefresh($rootScope.GAMEPAGE);
        app.username=$rootScope.username;

        (function startButton() {
            alert("The goal is to save as many patients as possible. Please switch to landscape mode if using a " +
                "mobile device or tablet!");

            // Get active game config and initialize game state object
            let activeGameConfig = {};
            let patientACount;
            let patientBCount;

            PatientService.getGameConfig().then(function (returnData) {
                //console.log("In start button");
                if (returnData.data.success) {
                    Scrolling('timeKeeper');
                    // console.log(returnData.data.config);
                    PatientService.initialize();

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
                    UserStats.create(app.username, activeGameConfig._id, versionNum);

                    // Start Agent resource sharing algorithm
                    Agent.NHShareResource(PatientService, app.gameState, versionNum);

                    // Agent playing algorithm.
                    Agent.NHHelpPatient(8000, app.gameState, $scope.counter);
                    //console.log("In start button- success")
                } else {
                    console.log("Failed to get configuration");
                    //console.log(returnData.data);
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
                $("#P1").find("#patientA").append('<img src="assets/images/green.png" class="statusImages" height = "30px" width="30px" >');
            }

            for (let j = 0; j < patientBCount; j++) {
                $("#P1").find("#patientB").append('<img src="assets/images/green.png" class="statusImages" height = "30px" width="30px" >');
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

        function getPageLoadCount(){
            let gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
            let pageLoadCount=gameSession.timesGameLoaded;
            return pageLoadCount;
        }
        



        function stopTimer(mytimeout) {
            console.log("Time stopped");
            $timeout.cancel(mytimeout);
            UserStats.updateScore(app.gameState.score);
            UserStats.setPageLoadCount(getPageLoadCount());
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
             $("#gameFinishedModal").modal("hide");
             $timeout(function(){
                
                let data={
                    lastStageCompleted:$rootScope.GAMEPAGE
                };
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
            PatientService.assignRoom(event.target.id, app.gameState, UserStats);
        });

        $('#btnB').click(function (event) {
            PatientService.assignRoom(event.target.id, app.gameState, UserStats);
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

        $('#btnRAccept').click(function (event) {
            let type = $('#shareResourceType').text();
            console.log('Updating game state');
            $('#shareResourceModal').modal("hide");
            if (type == 'Nurse') {
                app.gameState.otherNumberOfNurses -= 1;
                app.gameState.numberOfNurses   += 1;
            } else  if (type == 'Surgeon') {
                app.gameState.otherNumberOfSurgeons -= 1;
                app.gameState.numberOfSurgeons += 1;
            } else if (type == 'Doctor') {
                app.gameState.otherNumberOfDoctors -= 1;
                app.gameState.numberOfDoctors  += 1;
            }
        });

        $('#btnRADeny').click(function (event) {
            $('#shareResourceModal').modal("hide");
            console.log('Denied shared resource');
        });

        // Listener for the request resource buttons  
        $('#btnShareDoctor').click(function () {
            if (versionNum == 1) {
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
            } else {
                resetMsg();
                if (app.gameState.numberOfDoctors > 0) {
                    UserStats.addMove("PlayerShared, Doctor", $scope.counter, app.gameState);
                    let decision = Agent.decisionAlgorithm(app.gameState.cooperationMode);
                    console.log(decision);
                    if (decision) {
                        app.gameState.numberOfDoctors -= 1;
                        app.gameState.otherNumberOfDoctors += 1;
                        app.successMsg = "Shared Doctor is accepted by neighbouring hospital";
                        UserStats.addMove("AgentResponse, Accept", $scope.counter, app.gameState);
                    } else {
                        app.errorMsg = "Shared Doctor is denied by neighbouring hospital";
                        UserStats.addMove("AgentResponse, Deny", $scope.counter, app.gameState);
                    }
                } else {
                    $("#notifyModalTitle").text("Error");
                    $("#notifyModalbody").text("There are no doctors to share.");
                    $("#notifyModal").modal("show");
                    UserStats.addMove("DoctorShared, Failure", $scope.counter, app.gameState);
                }
            }
        });


        $('#btnShareSurgeon').click(function () {
            if (versionNum == 1) {
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
            } else {
                resetMsg();
                if (app.gameState.numberOfSurgeons > 0) {
                    UserStats.addMove("PlayerShared, Surgeon", $scope.counter, app.gameState);
                    let decision = Agent.decisionAlgorithm(app.gameState.cooperationMode);
                    if (decision) {
                        app.gameState.numberOfSurgeons -= 1;
                        app.gameState.otherNumberOfSurgeons += 1;
                        app.successMsg = "Shared surgeon is accepted by neighbouring hospital";
                        UserStats.addMove("AgentResponse, Accept", $scope.counter, app.gameState);
                    } else {
                        app.errorMsg = "Shared surgeon is denied by neighbouring hospital";
                        UserStats.addMove("AgentResponse, Deny", $scope.counter, app.gameState);
                    }
                    $location.hash('notify');
                    $anchorScroll();
                } else {
                    $("#notifyModalTitle").text("Error");
                    $("#notifyModalbody").text("There are no surgeons to share.");
                    $("#notifyModal").modal("show");
                    UserStats.addMove("SurgeonShared, Failure", $scope.counter, app.gameState);
                }
            }
        });


        $('#btnShareNurse').click(function () {
            if (versionNum == 1) {
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
            } else {
                resetMsg();
                if (app.gameState.numberOfNurses > 0) {
                    UserStats.addMove("PlayerShared, Nurse", $scope.counter, app.gameState);
                    let decision = Agent.decisionAlgorithm(app.gameState.cooperationMode);
                    $location.hash('notify');
                    $anchorScroll();
                    if (decision) {
                        app.gameState.numberOfNurses -= 1;
                        app.gameState.otherNumberOfNurses += 1;
                        app.successMsg = "Shared Nurse is accepted by neighbouring hospital";
                        UserStats.addMove("AgentResponse, Accept", $scope.counter, app.gameState);

                    } else {
                        app.errorMsg = "Shared Nurse is denied by neighbouring hospital";
                        UserStats.addMove("AgentResponse, Deny", $scope.counter, app.gameState);
                    }
                } else {
                    $("#notifyModalTitle").text("Error");
                    $("#notifyModalbody").text("There are no nurses to share.");
                    $("#notifyModal").modal("show");
                    UserStats.addMove("NurseShared, Failure", $scope.counter, app.gameState);
                }
            }
        });



        this.incrementPageLoadCount=function(){
            let gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
            let pageLoadCount=gameSession.timesGameLoaded;
            pageLoadCount=pageLoadCount+1;
            let data={
                        timesGameLoaded:pageLoadCount
                     }
            $rootScope.updateGameSession(data);
        }

        this.incrementPageLoadCount();
        

    });