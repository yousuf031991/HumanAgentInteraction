angular.module('preGameQuestionnaireControllers', ['questionnaireServices', 'refreshServices', 'scrollingServices'])
    .controller('preGameQuestionnaireCtrl', function ($location, $rootScope, $cookies, QuestionnaireService, Refresh, Scrolling) {

        let app = this;
        app.showTwoYearDegree = false;
        app.otherPurposes = false;
        app.currentDegreeSelected = undefined;
        app.computerUsageTypes = [];
        app.videoGameDevices = [];
        app.videoGameTypes = [];
        app.allDevicesUsed = [];
        app.questions = [];
        app.incompleteQuestions = [];
        app.noneOfTheAbove="None of the above";

        
        Refresh.checkRefresh($rootScope.DEMOGRAPHICS_QUESTIONNAIRE);

        app.username = $rootScope.username;

        app.showDegreeText = function (degreeId) {
            return degreeId == app.currentDegreeSelected;
        };

        app.setDegreeSelected = function (degreeId) {
            app.currentDegreeSelected = degreeId;
            app.highestDegreeMajor = null;

        };

        //Updates the set of selected values for questions with checkbox responses
        app.update = function (mapping, val, checked) {
            if (checked) {
                mapping[val] = true;
            }
            else {
                delete mapping[val];
            }
        };

        app.manageDevices=function(isNoneOfTheAbove,val,checked){

            if(isNoneOfTheAbove){
                
                app.allDevicesUsed=[];
                
                if(checked){
                    app.allDevicesUsed[val]=true;
                    app.useGPS=app.useBasicMobilePhone=app.useSmartPhonePDAIpad=false;
                }

            }
            else{
                if(checked){
                    delete app.allDevicesUsed[app.noneOfTheAbove];
                    app.noDevice=false;
                    app.allDevicesUsed[val]=true;
                }
                else{
                    delete app.allDevicesUsed[val];
                }
            }

        }

        
        app.validate=function(){
        	//To ensure that the user was navigated to this page from trial info page.
        	if(app.username==undefined)
        		return;


            if ($rootScope.checkTimeout()) {
                $location.path('/timeout');
                return;
            }

            app.reset();

            app.preProcess();

            if (app.age == undefined) {
                app.incompleteQuestions.push(document.getElementById('questionAge'));
            }

            if (app.gender == undefined) {
                app.incompleteQuestions.push(document.getElementById('questionGender'));
            }

            if (app.highestDegree == undefined) {
                app.incompleteQuestions.push(document.getElementById('questionHighestDegree'))
            }

            if (app.computerUsage == undefined) {
                app.incompleteQuestions.push(document.getElementById('questionComputerUsageFrequency'));
            }
            
            if (Object.keys(app.computerUsageTypes).length == 0) {
                app.incompleteQuestions.push(document.getElementById('questionComputerUsageTypes'));
            }
 
       	    if(Object.keys(app.videoGameDevices).length==0){
        		app.incompleteQuestions.push(document.getElementById('questionVideoGameDevices'));
        	}
            
            if(Object.keys(app.videoGameTypes).length==0){
        		app.incompleteQuestions.push(document.getElementById('questionVideoGameTypes'));
        	}
            
            if(Object.keys(app.allDevicesUsed).length==0){
        		app.incompleteQuestions.push(document.getElementById('questionDevicesUsed'));
        	}
            
            if(app.videoGameExperience==undefined){
        		app.incompleteQuestions.push(document.getElementById('questionVideoGameExperience'));	
        	}
        	
        	if(app.videoGameUsage==undefined){
        		app.incompleteQuestions.push(document.getElementById('questionVideoGameUsageFrequency'));
        	}
            
            if (app.incompleteQuestions.length > 0) {
                app.highlightIncompleteQuestions();
            }
            else {
                app.saveQuestionnaire();
            }

        }
        

        //Resets the style of all previously incomplete questions to default. 
        app.reset = function () {
            let len = app.incompleteQuestions.length;
            for (let i = 0; i < len; i++) {
                let question = app.incompleteQuestions[i];
                question.className = 'question';
            }
            app.questionnaireIncomplete = false;
            app.incompleteQuestions = [];
        };

        //For questions with checkbox responses, where 'others' option is selected
        app.preProcess = function () {
            if (app.otherPurposes) {
                app.computerUsageTypes['Others:' + app.otherComputerUsagePurpose] = true;
            }

            if (app.otherGameTypes) {
                app.videoGameTypes['Others:' + app.otherVideoGameTypeNames] = true;
            }
        };

        app.highlightIncompleteQuestions = function () {
            let len = app.incompleteQuestions.length;
            for (let i = 0; i < len; i++) {
                let question = app.incompleteQuestions[i];
                question.className = 'incomplete';
            }
            app.questionnaireIncomplete = "Please answer all the questions marked required(*). The questions in red are the required questions not answered by you.";
            Scrolling('errorMsg');
        };

        app.saveQuestionnaire = function () {
            let demographics = app.generateQuestionResponsePairs();
            let obj = {};
            obj.username = app.username;
            obj.demographics = demographics;
            QuestionnaireService.insertQuestionnaireResponse(obj).then(function (returndata) {

                if (returndata.data.success) {
                    let data = {
                        lastStageCompleted: $rootScope.DEMOGRAPHICS_QUESTIONNAIRE
                    };
                    $rootScope.updateGameSession(data);
                    alert("Please switch to landscape mode for a better game experience.");
                   $location.path('/tutorialPage');

                   //uncomment this for testing purpose.
                    //$location.path('/practicePage');

                    //$location.path('/gamepage/' + app.username);
                }
                else {
                    console.log("Message:" + returndata.data.message);
                }
            });
        };

        app.generateQuestionResponsePairs = function () {
            let pairs = [];
            app.createPair("Age", app.age, pairs);
            app.createPair("Gender", app.gender, pairs);
            app.createPair("College", app.college, pairs);
            app.createPair("Major", app.major, pairs);
            app.createPair("Degree in pursuit of", app.degree, pairs);
            app.createPair("No of years pursuing the degree", app.noOfYears, pairs);
            app.createPair("Occupation", app.occupation, pairs);
            app.createPair("Highest level of education earned", app.highestDegree, pairs);
            app.createPair("Highest degree major", app.highestDegreeMajor, pairs);
            app.createPair("Frequency of computer usage", app.computerUsage, pairs);
            app.createPair("Types of computer usage", app.collectKeys(app.computerUsageTypes), pairs);
            app.createPair("Video game devices owned / used", app.collectKeys(app.videoGameDevices), pairs);
            app.createPair("Types of video games played", app.collectKeys(app.videoGameTypes), pairs);
            app.createPair("Types of computing devices used", app.collectKeys(app.allDevicesUsed), pairs);
            app.createPair("Experience with video games", app.videoGameExperience, pairs);
            app.createPair("Frequency of playing video games", app.videoGameUsage, pairs);

            return pairs;

        };


        app.createPair = function (question, response, pairs) {
            let pair = {};
            pair.question = question;
            pair.response = response;

            pairs.push(pair);
        };

        //For questions with checkbox responses
        app.collectKeys = function (dict) {
            let keys = [];
            for (let key in dict) {
                keys.push(key);
            }

            return keys;

        }

    });