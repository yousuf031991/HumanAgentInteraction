angular.module('gamePageServices', ['roomServices', 'circleServices'])
    .factory('PatientService', function ($http, $timeout, Room, Circle) {

        let gamePageFactory = {};
        let roomSelector = "div[class='panel-body fixed-panel center']";
        let map = new Map();
        let patientMap = new Map();
        let roomMap = new Map();

        // Initial variables for Room
        let roomData = {};
        roomData.nDoctors = 0;
        roomData.nSurgeons = 0;
        roomData.nNurses = 0;
        roomData.patientType = null;
        roomData.timeLeft = 0;
        roomData.timeStarted = 0;
        roomData.collect = false;

        let startTimeMilliseconds = 480000;
        let practiceRound = false;
        // let interruptOn = false;
        let numPatientsForHighQuintuplet = 8;
        let numPatientsForMediumQuintuplet = 5;
        let numPatientsForLowQuintuplet = 2;
        let totalTimeLeftInMilliseconds = 0;

        let patientACount;
        let patientBCount;

        let totalMissedPatients = 0;
        let NHtotalMissedPatients = 0;

        // let highCooperation = true;
        let earlySlowPattern = true;
        let color;
        // let score = 0;

        // Create room instances
        let roomIds = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];
        let divIds = ['div1', 'div2', 'div3', 'div4', 'div5', 'div6'];
        let circleAIds = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'];
        let circleBIds = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'];


        for (let i = 0, len = roomIds.length; i < len; i++) {
            roomMap.set(roomIds[i], new Room(roomIds[i], roomData));
            map.set(divIds[i], "green");
            patientMap.set(divIds[i], null);
        }

        let circleAs = [];
        let circleBs = [];
        // Assume circleA and circleB lengths are equal
        for (let i = 0; i < circleAIds.length; i++) {
            circleAs.push(new Circle(circleAIds[i]));
            circleBs.push(new Circle(circleBIds[i]));
        }

        gamePageFactory.create = function (userStatsData) {
            return $http.post('/api/userStatistics', userStatsData);
        };

        gamePageFactory.getGameConfig = function () {
            return $http.get('/api/getGameConfig');
        };

        gamePageFactory.disableClick = function () {
            $(roomSelector).off('click');
            $(roomSelector).css("background", "");
        };

        //
        // gamePageFactory.updateSideBarMain = function (gameState) {
        //
        //     //gamePageFactory.updatePatientsinSideBar(gameState);
        //     //console.log('Updating side bar')
        //     /*   let docsCount = 0;
        //      let nursesCount = 0;
        //      let surgeonsCount = 0;
        //
        //      roomMap.forEach(function(value,key) {
        //      docs = value.nDoctors;
        //      if(value.nDoctors != 0) {
        //      docsCount++;
        //      }
        //      if(value.nSurgeons != 0) {
        //      surgeonsCount++;
        //      }
        //      if(value.nNurses != 0 ) {
        //      nursesCount ++;
        //      }
        //      });*/
        //
        // };

        gamePageFactory.updatePlayerPatientsInSideBar = function (patientACount, patientBCount) {
            /* console.log("Number of Patients A and B")
             console.log(" A and B" + patientACount +" "+ patientBCount)
             */

            // Make all patient circles invisible


            for (let i = 0; i < circleAs.length; i++) {
                circleAs[i].setVisibility('invisible', 'A');
                circleBs[i].setVisibility('invisible', 'B');
            }

            // Update number of patient A circles
            for (let i = 0; i < patientACount; i++) {
                circleAs[i].setVisibility('visible', 'A');
            }

            // Update number of patient B circles
            for (let i = 0; i < patientBCount; i++) {
                circleBs[i].setVisibility('visible');
            }

            /*console.log("Number of patientAs: " + patientACount);
            console.log("Number of patientBs: " + patientBCount);
            console.log("totalMissedPatients: " + totalMissedPatients);
*/

            // Updating the colors for player waiting queue
            let total = patientACount + patientBCount;

            $("#P1").find("#patientA").html("");
            $("#P1").find("#patientB").html("");

            if (total >= 0 && total <= 2) {
                gamePageFactory.setColor(patientACount, patientBCount, 'green');
                color = 'green';
            } else if (total > 2 && total <= 4) {
                gamePageFactory.setColor(patientACount, patientBCount, 'yellow');
                color = 'yellow';
            } else if (total > 4 && total <= 6) {
                gamePageFactory.setColor(patientACount, patientBCount, 'red');
                color = 'red';
            }
        };

        gamePageFactory.updateAgentPatientsInSidebar = function (patientACount, patientBCount){
            // Updating the colors for agent waiting queue
            let otherTotal = patientACount + patientBCount;
            let otherPatientADiv = $("#P2").find("#otherPatientA");
            let otherPatientBDiv = $("#P2").find("#otherPatientB");

            let greenSquare = "<div class='square center bg-green'></div>";
            let yellowSquare = "<div class='square center bg-yellow'></div>";
            let redSquare = "<div class='square center bg-red'></div>";

            otherPatientADiv.html("");
            otherPatientBDiv.html("");
            // console.log(otherTotal);
            if (otherTotal >= 0 && otherTotal <= 2) {
                otherPatientADiv.append(greenSquare);
                otherPatientBDiv.append(greenSquare);
            } else if (otherTotal > 2 && otherTotal <= 4) {
                otherPatientADiv.append(yellowSquare);
                otherPatientBDiv.append(yellowSquare);
            } else if (otherTotal > 4 && otherTotal <= 6) {
                otherPatientADiv.append(redSquare);
                otherPatientBDiv.append(redSquare);
            }
        };

        gamePageFactory.setColor = function (numOfPatientA, numOfPatientB, color) {
            let x = numOfPatientA;
            let y = numOfPatientB;

            while (x != 0) {
                $("#P1").find("#patientA").append('<img src="assets/images/' + color + '.png" height = "30px" width="30px" >');
                x -= 1;
            }

            while (y != 0) {
                $("#P1").find("#patientB").append('<img src="assets/images/' + color + '.png" height = "30px" width="30px" >');
                y -= 1;
            }


            /* console.log("In setColor")
             console.log(circleA1)
             console.log(circleA2)
             console.log(circleA3)
             console.log(circleA4)
             console.log(circleA5)
             console.log(circleA6)

             console.log(circleB1)
             console.log(circleB2)
             console.log(circleB3)
             console.log(circleB4)
             console.log(circleB5)
             console.log(circleB6)*/
            /*if(circleA1.getVisibility() === 'visible')
             circleA1.setCircleColor(color, 'A')
             if(circleA2.getVisibility() === 'visible')
             circleA2.setCircleColor(color, 'A')
             if(circleA3.getVisibility() === 'visible')
             circleA3.setCircleColor(color, 'A')
             if(circleA4.getVisibility() === 'visible')
             circleA4.setCircleColor(color, 'A')
             if(circleA5.getVisibility() === 'visible')
             circleA5.setCircleColor(color, 'A')
             if(circleA6.getVisibility() === 'visible')
             circleA6.setCircleColor(color, 'A')

             if(circleB1.getVisibility() === 'visible')
             circleB1.setCircleColor(color, 'B')
             if(circleB2.getVisibility() === 'visible')
             circleB2.setCircleColor(color, 'B')
             if(circleB3.getVisibility() === 'visible')
             circleB3.setCircleColor(color, 'B')
             if(circleB4.getVisibility() === 'visible')
             circleB4.setCircleColor(color, 'B')
             if(circleB5.getVisibility() === 'visible')
             circleB5.setCircleColor(color, 'B')
             if(circleB6.getVisibility() === 'visible')
             circleB6.setCircleColor(color, 'B')            */

        };

        gamePageFactory.newPatient = function (gameState) {
            /*console.log("Printing patientA's and patientB's" + patientACount + patientBCount)*/
            let milliseconds;
            let quintupletTimeLeft = startTimeMilliseconds / 5;

            /* console.log("startTimeMilliseconds " + startTimeMilliseconds);
            console.log("quintupletTimeLeft " + quintupletTimeLeft);
            */
            //totalTimeLeftInMilliseconds = x;
            // i++;

            if (practiceRound) {
                milliseconds = quintupletTimeLeft / numPatientsForMediumQuintuplet;
            } else {
                if (earlySlowPattern) {
                    switch (gamePageFactory.whichQuintupletTimeLeft()) {
                        case 1:
                        case 3:
                        case 5:
                        case 2:
                            milliseconds = quintupletTimeLeft / numPatientsForLowQuintuplet;
                            break;
                        case 4:
                            milliseconds = quintupletTimeLeft / numPatientsForHighQuintuplet;
                            break;
                        default:
                            milliseconds = quintupletTimeLeft / numPatientsForMediumQuintuplet;
                            break;
                    }
                }
                else {
                    switch(gamePageFactory.whichQuintupletTimeLeft()){
                        case 1:
                        case 3:
                        case 5:
                        case 4:
                            milliseconds = quintupletTimeLeft/numPatientsForLowQuintuplet;
                            break;
                        case 2:
                            milliseconds = quintupletTimeLeft/numPatientsForHighQuintuplet;
                            break;
                        default:
                            milliseconds = quintupletTimeLeft/numPatientsForMediumQuintuplet;
                            break;
                    }
                }
              //  console.log("Printing milliseconds " + milliseconds)
            }

            //start a countdowntimer which takes countdown value and timeinterval as milliseconds
            gamePageFactory.countdownTimer(milliseconds, gameState);

        };


        gamePageFactory.countdownTimer = function (milliseconds, gameState) {

          //  console.log("In countdown printing milliseconds value: " + milliseconds)
            setTimeout(function () {
                if (totalTimeLeftInMilliseconds !== 0) {

                    // alert("Updating patients");
                   // console.log("\n In countdown timer function");
                    let patient = 1 + parseInt(Math.random() * ((1) + 1));
                    // console.log(patient)

                   // console.log("patientACount and patientBCount in countdowntimer: " + patientACount + patientBCount)
                    
                    let totalPatients = gameState.numberOfPatientAs + gameState.numberOfPatientBs;
                    if (patient % 2 == 0) {
                        if (totalPatients < 6) {
                            gameState.numberOfPatientAs += 1;
                            //writeStringAsFile
                        } else {
                            totalMissedPatients++;
                            //writeStringAsFile
                        }
                        gamePageFactory.updatePlayerPatientsInSideBar(gameState.numberOfPatientAs, gameState.numberOfPatientBs);
                        gamePageFactory.newPatient(gameState);


                    } else if (patient % 2 == 1) {
                        if (totalPatients < 6) {
                            gameState.numberOfPatientAs += 1;
                            //writeStringAsFile
                        } else {
                            totalMissedPatients++;
                            //writeStringAsFile
                        }
                        gamePageFactory.updatePlayerPatientsInSideBar(gameState.numberOfPatientAs, gameState.numberOfPatientBs);
                        gamePageFactory.newPatient(gameState);
                    }

                }

            }, milliseconds);
        };


        gamePageFactory.newPatientforNH = function(gameState) {

            //console.log("Printing patientA's and patientB's for NH" + otherNumberOfPatientAsCount + otherNumberOfPatientBsCount)
            let milliseconds;
            let quintupletTimeLeft = startTimeMilliseconds / 5;
            //console.log("startTimeMilliseconds " + startTimeMilliseconds);
            //console.log("quintupletTimeLeft " + quintupletTimeLeft);

            //totalTimeLeftInMilliseconds = x;
            // i++;

            if (practiceRound) {
                quintupletTimeLeft = 480000 / 5;
                milliseconds = quintupletTimeLeft / numPatientsForMediumQuintuplet;
            } else {
                if (earlySlowPattern) {
                    switch (gamePageFactory.whichQuintupletTimeLeft()) {
                        case 1:
                        case 3:
                        case 5:
                        case 2:
                            milliseconds = quintupletTimeLeft / numPatientsForLowQuintuplet;
                            break;
                        case 4:
                            milliseconds = quintupletTimeLeft / numPatientsForHighQuintuplet;
                            break;
                        default:
                            milliseconds = quintupletTimeLeft / numPatientsForMediumQuintuplet;
                            break;
                    }
                }
                else {
                    switch(whichQuintupletTimeLeft()){
                        case 1:
                        case 3:
                        case 5:
                        case 4:
                            milliseconds = quintupletTimeLeft/numPatientsForLowQuintuplet;
                            break;
                        case 2:
                            milliseconds = quintupletTimeLeft/numPatientsForHighQuintuplet;
                            break;
                        default:
                            milliseconds = quintupletTimeLeft/numPatientsForMediumQuintuplet;
                            break;

                    }
                }
                //console.log("Printing milliseconds " + milliseconds)
            }

            //start a countdowntimer which takes countdown value and timeinterval as milliseconds
            gamePageFactory.countdownTimerforNH(milliseconds, gameState);

        };

        gamePageFactory.countdownTimerforNH = function(milliseconds, gameState) {

            setTimeout(function () {
                if (totalTimeLeftInMilliseconds !== 0) {

                    // alert("Updating patients");
                   //FF console.log("\n In countdown timer function");
                    let patient = 1 + parseInt(Math.random() * ((1) + 1));
                    let totalPatientCount = gameState.otherNumberOfPatientAs + gameState.otherNumberOfPatientBs;
                    // console.log(patient)

                    if (patient % 2 == 0) {
                        if (totalPatientCount < 6) {
                            gameState.otherNumberOfPatientAs += 1;
                            //writeStringAsFile
                        } else {
                            NHtotalMissedPatients++;
                            //writeStringAsFile
                        }
                        gamePageFactory.updateAgentPatientsInSidebar(gameState.otherNumberOfPatientAs, gameState.otherNumberOfPatientBs);
                        gamePageFactory.newPatientforNH(gameState);


                    } else if (patient % 2 == 1) {
                        if (totalPatientCount < 6) {
                            gameState.otherNumberOfPatientBs += 1;
                            //writeStringAsFile
                        } else {
                            NHtotalMissedPatients++;
                            //writeStringAsFile
                        }
                        gamePageFactory.updateAgentPatientsInSidebar(gameState.otherNumberOfPatientAs, gameState.otherNumberOfPatientBs);
                        gamePageFactory.newPatientforNH(gameState);
                    }

                }

            }, milliseconds);
        };

        gamePageFactory.whichQuintupletTimeLeft = function () {
            let quintupletTimeLeft = startTimeMilliseconds / 5;
            // console.log(totalTimeLeftInMilliseconds);
            if (totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft) //First Quintuplet
                return 1;

            if (totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft * 2) //Second Quintuplet
                return 2;

            if (totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft * 3) //Third Quintuplet
                return 3;

            if (totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft * 4) //Fourth Quintuplet
                return 4;

            if (totalTimeLeftInMilliseconds > startTimeMilliseconds - quintupletTimeLeft * 5) //Fifth Quintuplet
                return 5;
            return 1;
        };


        gamePageFactory.updateRoomInfo = function (resourceId, gameState, currentTime, userStats) {
            // Updates the text in the clicked room panel
            $("div[class='panel panel-success'] " + roomSelector).bind('click', function (e) {
                e.preventDefault();

                let success = true;
                let myroomid = event.target.id;
                let __roomId = myroomid.replace("R", "div");

                if (resourceId === 'btnDoctor') {
                    // Checking if enough doctors are present
                    if (gameState.numberOfDoctors > 0) {
                        gameState.numberOfDoctors -= 1;
                        roomMap.get(myroomid).nDoctors = 1;
                        $("#" + myroomid + " span[id='nDoctors']").text(roomMap.get(myroomid).nDoctors);
                    } else {
                        $('#notifyModalTitle').text("Error");
                        $("#notifyModalbody").text("Insufficient Number of Doctors");
                        //noinspection JSUnresolvedFunction
                        $("#notifyModal").modal("show");
                        userStats.addMove("FailAssign, Doctor", currentTime, gameState);
                    }
                } else if (resourceId === 'btnSurgeon') {
                    // Checking if enough surgeons are present
                    if (gameState.numberOfSurgeons > 0) {
                        // gamePageFactory.updateRoomInfo(resourceId);
                        gameState.numberOfSurgeons -= 1;
                        roomMap.get(myroomid).nSurgeons = 1;
                        $("#" + myroomid + " span[id='nSurgeons']").text(roomMap.get(myroomid).nSurgeons);
                    } else {
                        $('#notifyModalTitle').text("Error");
                        $("#notifyModalbody").text("Insufficient Number of Surgeons");
                        //noinspection JSUnresolvedFunction
                        $("#notifyModal").modal("show");
                        userStats.addMove("FailAssign, Surgeon", currentTime, gameState);
                    }
                } else if (resourceId === 'btnNurse') {
                    // Checking if enough nurses are present
                    if (gameState.numberOfNurses > 0) {
                        // gamePageFactory.updateRoomInfo(resourceId);
                        gameState.numberOfNurses -= 1;
                        roomMap.get(myroomid).nNurses = 1;
                        $("#" + myroomid + " span[id='nNurses']").text(roomMap.get(myroomid).nNurses);
                    } else {
                        $('#notifyModalTitle').text("Error");
                        $("#notifyModalbody").text("Insufficient Number of Nurses");
                        //noinspection JSUnresolvedFunction
                        $("#notifyModal").modal("show");
                        userStats.addMove("FailAssign, Nurse", currentTime, gameState);
                    }
                }
                else if (resourceId === 'btnA') {
                    if (gameState.numberOfPatientAs > 0) {
                        roomMap.get(myroomid).patientType = 'Patient A';
                        $("#" + myroomid + " span[id='assignedPatient']").text(roomMap.get(myroomid).patientType);
                        $('#' + __roomId).removeClass().addClass('panel panel-danger');
                        map.set(__roomId, 'red');
                        patientMap.set(__roomId, 'patientA');
                        //console.log("Printing doctors and nurses");
                        //console.log("Patient A assigned. Patient A Count: " + patientACount);
                        gameState.numberOfPatientAs -= 1;
                        gamePageFactory.update2(gameState.numberOfPatientAs, gameState.numberOfPatientBs);
                    } else {
                        $('#notifyModalTitle').text("Error");
                        $("#notifyModalbody").text("Insufficient Number of Patient As");
                        //noinspection JSUnresolvedFunction
                        $("#notifyModal").modal("show");
                        success = false;
                        //console.log("No patient As are available currently");
                        // return;
                    }
                } else if (resourceId == 'btnB') {

                    if (gameState.numberOfPatientBs > 0) {

                        roomMap.get(myroomid).patientType = 'Patient B';
                        $("#" + myroomid + " span[id='assignedPatient']").text(roomMap.get(myroomid).patientType);
                        $('#' + __roomId).removeClass().addClass('panel panel-danger');
                        map.set(__roomId, 'red');
                        patientMap.set(__roomId, 'patientB');

                        //console.log("Patient B assigned. Patient B count: " + patientBCount);
                        gameState.numberOfPatientBs -= 1;
                        gamePageFactory.update2(gameState.numberOfPatientAs, gameState.numberOfPatientBs);
                    } else {
                        $('#notifyModalTitle').text("Error");
                        $("#notifyModalbody").text("Insufficient Number of Patient Bs");
                        //noinspection JSUnresolvedFunction
                        $("#notifyModal").modal("show");
                        success = false;
                        // console.log("No patient Bs are available currently");
                        // return;
                    }

                }

                // Success indicates if patient assigned is successful
                if (success) {
                    // Update room color
                    let divid = $(this).parent("div[class='panel panel-success']").attr("id");
                    $('#' + divid).removeClass().addClass('panel panel-danger');
                    
                    // Save room color in map
                    map.set(divid, 'red');
                }

                // Disables mulitple assignments
                gamePageFactory.disableClick();

                //Collecting resources
                gamePageFactory.isCollectible(gameState, currentTime, userStats);
            });
        };


        gamePageFactory.update2 = function (patientACount, patientBCount) {

            let patientADiv;
            let patientBDiv;
            let total = patientACount + patientBCount;
            let x = patientACount;
            let y = patientBCount;

            //console.log("X value: " + x + "Y value: " + y);

            patientADiv = $("#P1").find("#patientA");
            patientBDiv = $("#P1").find("#patientB");

            patientADiv.html("");
            patientBDiv.html("");

            if (total >= 0 && total <= 2) {
                color = 'green';
            } else if (total > 2 && total <= 4) {
                color = 'yellow';
            } else if (total > 4 && total <= 6) {
                color = 'red';
            }

            if (x > 0) {
                while (x != 0) {
                    patientADiv.append('<img src="assets/images/' + color + '.png" height = "30px" width="30px" >');
                    x -= 1;
                }
            }

            if (y > 0) {
                while (y != 0) {
                    patientBDiv.append('<img src="assets/images/' + color + '.png" height = "30px" width="30px" >');
                    y -= 1;
                }

            }


        };

        gamePageFactory.timeProgress = function (timeleft) {
            totalTimeLeftInMilliseconds = timeleft;
        };

        gamePageFactory.collectResource = function (roomId, gameState, finishedTime, userStats) {

           //alert("Time over. Collect resources")
            
            let divi2 = roomId.replace("R", "div");
            let roomDiv = $(`#${roomId}`);

            // Reset room
            roomDiv.text('');

            // Introduce a collect resources button and bind it to reset room to vacant state
            roomDiv.append('<button id = "collectButton">Collect Resources</button>');
            roomDiv.find('#collectButton').bind('click', function() {
                gamePageFactory.resetToVacantState(roomId, gameState);
            });

            // Update gamestate based on room map
            userStats.addMove("PlayerCollect," + roomId, finishedTime, gameState);

            // Update game score
            gameState.score += 1;

            $("#playerScore").trigger('change');


            map.set(divi2, 'red');
            gamePageFactory.disableClick();

            patientMap.set(divi2, null);

             $("#rTimeoutmodal").modal("show")

            //let modal = document.getElementById('mymodal');
            /* $("#rTimeoutmodal").modal("show")
             $("#modalbody").append('<a id = "collect"></a>')
             $('#modalbody #collect').text("Collect from "+roomId)
             $('#modalbody #collect').click(function() {
             gamePageFactory.resetToVacantState(roomId);
             });
             */

            /* $("#rTimeoutmodal").modal("show");
             console.log($("#rTimeoutmodal").modal("show"));
             console.log($("#rTimeoutmodal").modal("hide"));

             $("#modalbody").append('<a id = "collect"></a>')
             $('#modalbody #collect').append("Collect from "+roomId)
             $('#modalbody #collect').click(function() {
             gamePageFactory.resetToVacantState(roomId);
             });*/

            // add a modal pane as alert
        };

        gamePageFactory.resetToVacantState = function (roomId, gameState) {
            // alert(roomId);
            // let vacantDiv = $("#" + roomId);
            // Before resetting update sidebar

            gameState.numberOfDoctors += roomMap.get(roomId).nDoctors;
            gameState.numberOfNurses += roomMap.get(roomId).nNurses;
            gameState.numberOfSurgeons += roomMap.get(roomId).nSurgeons;

            let vacantDiv = $('<div class="panel-body fixed-panel center" id=' + roomId + ' >' +
                '<span id="assignedPatient">VACANT</span> <br/>' +
                '<span id="nDoctors">0</span> Doctors <br/>' +
                '<span id="nNurses">0</span> Nurses <br/>' +
                '<span id="nSurgeons">0</span> Surgeons <br/>' +
                '</div>');

            console.log(vacantDiv);
            $("#" + roomId).replaceWith(vacantDiv);
            gamePageFactory.resetToDefault(roomId);

            //noinspection JSUnresolvedFunction
            $("#rTimeoutmodal").modal("hide");

            // Reset map



        };

        gamePageFactory.resetToDefault = function (roomId) {

            // Reset room map
            roomMap.get(roomId).nDoctors = 0;
            roomMap.get(roomId).nNurses = 0;
            roomMap.get(roomId).nSurgeons = 0;

            let divId = roomId.replace("R", "div");
            // alert("in reset function");
            let roomObject = roomMap.get(roomId);
            roomObject.nDoctors = 0;
            roomObject.nSurgeons = 0;
            roomObject.nNurses = 0;
            roomObject.patientType = null;
            roomObject.timeLeft = 0;
            roomObject.timeStarted = 0;
            roomObject.collect = false;

            // send the resources which are to be collected to gameState(Tharun)
            //[doctor, nurse, surgeon, patient type]
            roomMap.set(roomId, roomObject);
            patientMap.set(divId, null);
            map.set(divId, "green");
            //console.log(roomObject)
        };

        gamePageFactory.isCollectible = function (gameState, currentTime, userStats) {

            //iterate over map and collect resources
            roomMap.forEach(function (value, key) {
                if (value.patientType === 'Patient A' && value.nDoctors === 1 && value.nNurses === 1 && value.collect === false) {

                    value.timeStarted = 60;
                    
                    //$("#" + key + "span[id='timerForRoom']").show();
                    $("#" + key).append('<span id="timerForRoom">Timer started!</span>');
                    // $timeout(gamePageFactory.showTimer(), 1000);

                    gamePageFactory.showTimer(key, gameState, currentTime, userStats);
                    //$scope.roomTimer = 0;

                    value.collect = true;


                } else if (value.patientType === 'Patient B' && value.nSurgeons === 1 && value.nNurses === 1 && value.collect === false) {
                    //alert("start the timer")
                    value.timeStarted = 60;
                    $("#" + key).append('<span id="timerForRoom">Timer started!</span>');
                    gamePageFactory.showTimer(key, gameState, currentTime, userStats);
                    value.collect = true
                }
            });
        };


        gamePageFactory.showTimer = function (key, gameState, currentTime, userStats) {

            let seconds = 6;
            let rt = "00:06";

            // let seconds = 60;
            // let rt = "01:00";

            let roomTimer = setInterval(function () {
                let minutes = Math.round((seconds - 30) / 60),
                    remainingSeconds = seconds % 60;

                if (remainingSeconds < 10) {
                    remainingSeconds = "0" + remainingSeconds;
                }

                if (minutes < 10) {
                    minutes = "0" + minutes;
                }

                if (seconds == 0) {
                    // rt = "00:00";
                    clearInterval(roomTimer);
                    let initialTime = currentTime.split(":");

                    // Subtract one minute from the time when the timer started.
                    // As timer for room is changed, this param should be updated
                    let finishedTime = (parseInt(initialTime[0]) - 1) + ":" + initialTime[1];
                    gamePageFactory.collectResource(key, gameState, finishedTime, userStats);

                } else {
                    seconds--;
                }


                rt = minutes + ":" + remainingSeconds;
                $("#" + key + " #timerForRoom").text("Time left: " + rt);

            }, 1000);

        };


        gamePageFactory.assignRoom = function (patientType, gameState, userStats) {

            map.forEach(function (value, key) {

               // console.log(key, value);
                if (value == 'green') {
                    //change div panel to success
                    $('#' + key).removeClass().addClass('panel panel-success');

                    // let rId = key.replace("div", "R");
                    //make that room hoverable
                    $('#' + key).hover(function () {
                            $(this).css("background", "#D3D3D3");
                        },
                        function () {
                            $(this).css("background", "");
                        }
                    );
                } else if (value == 'red') {
                    //change div to red danger
                    $(`#${key}`).removeClass().addClass('panel panel-danger');
                    $(`#${key}`).hover(function () {
                            $(this).css("background", "");
                        },
                        function () {
                            $(this).css("background", "");
                        }
                    );
                }
            });


            gamePageFactory.updateRoomInfo(patientType, gameState, totalTimeLeftInMilliseconds, userStats);

        };

        gamePageFactory.assignResource = function (resourceId, gameState, currentTime, userStats) {
            //alert("resource id in assignResource " + resourceId)
            //console.log("Printing key value in assignResource")
            patientMap.forEach(function (value, key) {

                let bodyId = key.replace("div", "R");

                let assignedPatient = $("#" + bodyId + " span[id='assignedPatient']").text();
                //console.log("Assigned Patient value: " + assignedPatient);

                //console.log("Assigned patient: " + assignedPatient)

                if ((resourceId === 'btnDoctor' && value === 'patientA')) {

                    //check if there's already a doctor assigned
                    let doctorCount = $("#" + bodyId + " span[id='nDoctors']").text();

                   // console.log("Doctor count: " + doctorCount) 
                    if (doctorCount == 0) {

                        $('#' + bodyId).hover(function () {
                                $(this).css("background", "#D3D3D3");
                            },
                            function () {
                                $(this).css("background", "");
                            }
                        );

                        $('#' + key).removeClass().addClass('panel panel-success');

                    } else if (doctorCount == 1) {

                        $('#' + bodyId).hover(function () {
                                $(this).css("background", "");
                            },
                            function () {
                                $(this).css("background", "");
                            }
                        );
                        $('#' + key).removeClass().addClass('panel panel-danger');
                    }


                } else if ((resourceId === 'btnSurgeon') && (value === 'patientB')) {

                    //check if there's already a surgeon assigned
                    let surgeonCount = $("#" + bodyId + " span[id='nSurgeons']").text();
                  //  console.log("surgeon count:  " + surgeonCount)
                    if (surgeonCount == 0) {

                        $('#' + bodyId).hover(function () {
                                $(this).css("background", "#D3D3D3");
                            },
                            function () {
                                $(this).css("background", "");
                            }
                        );
                        $('#' + key).removeClass().addClass('panel panel-success');


                    } else if (surgeonCount == 1) {

                        $('#' + bodyId).hover(function () {
                                $(this).css("background", "");
                            },
                            function () {
                                $(this).css("background", "");
                            }
                        );
                        $('#' + key).removeClass().addClass('panel panel-danger');
                    }

                }
                else if (resourceId === 'btnNurse' && (assignedPatient != 'VACANT')) {

                    if(0 === assignedPatient.length) {
                        $('#' + key).removeClass().addClass('panel panel-danger');
                    } else {                
                    //check if there's already a nurse assigned
                    let nurseCount = $("#" + bodyId + " span[id='nNurses']").text();
                    //console.log("In nurse with nurseCount: " + nurseCount)
                    //console.log(nurseCount);
                    if (nurseCount == 0) {
                        $('#' + bodyId).hover(function () {
                                $(this).css("background", "#D3D3D3");
                            },
                            function () {
                                $(this).css("background", "");
                            }
                        );
                        $('#' + key).removeClass().addClass('panel panel-success');

                    } else {
                        $('#' + bodyId).hover(function () {
                                $(this).css("background", "");
                            },
                            function () {
                                $(this).css("background", "");
                            }
                        );
                        $('#' + key).removeClass().addClass('panel panel-danger');
                    }
                    }
                }
                else {

                    $('#' + key).removeClass().addClass('panel panel-danger');
                }


            });
           // console.log(resourceId);
            gamePageFactory.updateRoomInfo(resourceId, gameState, currentTime, userStats);
        };

        return gamePageFactory;
    });