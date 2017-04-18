angular.module('postGameQuestionnaireControllers', ['questionnaireServices', 'refreshServices', 'scrollingServices'])
    .controller('postGameQuestionnaireCtrl', function ($scope,$timeout,$rootScope, $location, $cookies, QuestionnaireService, Refresh, Scrolling) {

        let app = this;
        app.questionnaireIncomplete = false;
        app.questions = [];
        app.responses = [];
        app.tableRows = [];
        app.unansweredQuestions = [];

        app.trustQuestionnaireRows = [];
        app.taskQuestionnaireRows = [];

        Refresh.checkRefresh($rootScope.TRUST_TASK_QUESTIONNAIRE);

        app.username = $rootScope.username;


        let incompleteQuestionnaireMessage = "Please answer all the questions. The questions marked red are the questions unanswered by you";


        app.collectQuestions = function () {
            let arr = document.getElementsByClassName('postGameQuestion');
            let len = arr.length;
            for (let i = 0; i < len; i++) {
                app.tableRows.push(arr[i]);
                app.questions.push(arr[i].textContent);
            }

        };

        app.getRows = function () {
            let trustQuestionnaireTable = document.getElementById('trustQuestionnaireTable');
            app.trustQuestionnaireRows = angular.element(trustQuestionnaireTable.getElementsByClassName("questionnaireRowClass"));
            let taskQuestionnaireTable = document.getElementById('taskQuestionnaireTable');
            app.taskQuestionnaireRows = angular.element(taskQuestionnaireTable.getElementsByClassName('questionnaireRowClass'));
        };


        app.validateResponse = function () {

            if (app.username == undefined)
                return;


            if ($rootScope.checkTimeout()) {
                $location.path('/timeout');
                return;
            }

            app.reset();

            let responses = app.responses;

            if (app.questions.length == 0) {
                app.collectQuestions();
            }
            let rows = app.questions.length;
            let len = responses.length;
            let response;

            for (let i = 0; i < len; i++) {
                response = responses[i];
                if (response == undefined) {
                    app.unansweredQuestions.push(i);
                }
            }

            if (len < rows) {
                for (let i = len; i < rows; i++) {
                    app.unansweredQuestions.push(i);
                }
            }

            if (app.unansweredQuestions.length > 0) {

                app.highlightUnansweredRows();
                app.questionnaireIncomplete = incompleteQuestionnaireMessage;
                Scrolling("errorMsg");
            }
            else {

                app.saveGameResponses();
            }

        };

        app.highlightUnansweredRows = function () {

            let len = app.unansweredQuestions.length;
            let element;
            for (let i = 0; i < len; i++) {
                //console.log(unanswered[i]);
                element = app.tableRows[app.unansweredQuestions[i]];
                element.className = 'incomplete';
            }

        };

        app.checkOverlap = function (rows, top, bottom) {// Function to check whether stickyheader is overlapping with any rows in the questionnaire table


            let len = rows.length;
             
            for (let i = 0; i < len; i++) {
                
                let row = rows[i];
                let radioButtons = row.getElementsByClassName('questionnaireRadioButton');
                let radioButtonRect = radioButtons[0].getBoundingClientRect();
                
                if (radioButtonRect.top >= top && radioButtonRect.bottom <= bottom || radioButtonRect.top <= top && radioButtonRect.bottom >= top || radioButtonRect.top <= bottom && radioButtonRect.bottom >= bottom) {
                    row.style.opacity = 0.0;
                    row.disabled = true;
                
                }
                else {
                    row.style.opacity = 1.0;
                    row.disabled = false;
                }
            }
          

        };


        app.reset = function () {
            app.unansweredQuestions = [];
            let len = app.tableRows.length;
            let row;
            for (let i = 0; i < len; i++) {
                row = app.tableRows[i];
                row.className = 'postGameQuestion';
            }
            app.questionnaireIncomplete = false;

        };


        app.makeStickyHeader = function () {
            $timeout(function(){ 
            angular.element(document.getElementById('trustQuestionnaireTable')).on('scroll',function (event) {
                let stickyHeader = 'translate(0,' + this.scrollTop + 'px)';
                document.getElementById('trustQuestionnaireHeader').style.transform = stickyHeader;
                //console.log("Scroll Top:"+this.scrollTop);
                let rect = document.getElementById('trustQuestionnaireHeader').getBoundingClientRect();
                app.checkOverlap(app.trustQuestionnaireRows, rect.top, rect.bottom);
            });

            angular.element(document.getElementById('taskQuestionnaireTable')).on('scroll',function (event) {
                let stickyHeader = 'translate(0,' + this.scrollTop + 'px)';
                document.getElementById('taskQuestionnaireHeader').style.transform = stickyHeader;
                let rect = document.getElementById('taskQuestionnaireHeader').getBoundingClientRect();
                app.checkOverlap(app.taskQuestionnaireRows, rect.top, rect.bottom);
            });
           });
            
        };

        app.makeQuestionResponsePairs = function () {
            let pairs = [];
            let len = app.questions.length;
            let pair;
            for (let i = 0; i < len; i++) {
                pair = {};
                pair.question = (app.questions[i]).trim();
                pair.response = (app.responses[i]).trim();
                pairs.push(pair);
            }
            return pairs;
        };


        app.saveGameResponses = function (questions, responses) {
            let questionResponsePairs = app.makeQuestionResponsePairs(questions, responses);
            let obj = {};
            obj.username = $rootScope.username;
            obj.trustAndTaskQuestionnaire = questionResponsePairs;
            QuestionnaireService.insertQuestionnaireResponse(obj).then(function (returnData) {
                if (returnData.data.success) {
                    let data = {
                        lastStageCompleted: $rootScope.TRUST_TASK_QUESTIONNAIRE
                    };

                    $rootScope.updateGameSession(data);

                    $location.path('/thankyou');
                }
                else {
                    console.log(returnData.data.message);
                }
            });
        };

        app.init = function () {
            
            app.getRows();

            app.makeStickyHeader();
        };

        app.init();

    });