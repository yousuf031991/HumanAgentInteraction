angular.module('postGameQuestionnaireControllers', ['questionnaireServices','scrollingServices'])
    .controller('postGameQuestionnaireCtrl', function($rootScope,$location,$cookies,QuestionnaireService,Scrolling) {
        
        let app = this;
        app.questionnaireIncomplete=false;
        app.questions=[];
        app.responses=[];
        app.tableRows=[];
        app.unansweredQuestions=[];

        app.username=$rootScope.username;


        let incompleteQuestionnaireMessage="Please answer all the questions. The questions marked red are the questions unanswered by you";

        
        app.collectQuestions=function(){
          var arr=document.getElementsByClassName('postGameQuestion');
          var len=arr.length;
          for(var i=0;i<len;i++){
            app.tableRows.push(arr[i]);
            app.questions.push(arr[i].textContent);
            }

        }


        app.validateResponse=function(){
              
              if(app.username==undefined)
                return;
              

              app.reset();

              var responses=app.responses;
              
              if(app.questions.length==0){
                  app.collectQuestions();
                }
              var rows=app.questions.length;
              var len=responses.length;
              var response;
              
              for(var i=0;i<len;i++){
                response=responses[i];
                if(response == undefined){
                  app.unansweredQuestions.push(i);
                }  
              }

              if(len<rows){
                for(var i=len;i<rows;i++){
                  app.unansweredQuestions.push(i);
                }
              }

              if(app.unansweredQuestions.length>0){
                
                app.highlightUnansweredRows();
                app.questionnaireIncomplete=incompleteQuestionnaireMessage;
                Scrolling("errorMsg");
              }
              else{

                  app.saveGameResponses();
              }

        }

        app.highlightUnansweredRows=function(){
                     
                     var len=app.unansweredQuestions.length;
                     var element;
                     for(var i=0;i<len;i++){
                      //console.log(unanswered[i]);
                      element=app.tableRows[app.unansweredQuestions[i]];
                      element.className='incomplete';                                             
          }

        }


        app.reset=function(){
          app.unansweredQuestions=[];
          var len=app.tableRows.length;
          var row;
          for(var i=0;i<len;i++){
            row=app.tableRows[i];
            row.className='postGameQuestion';
          }
          app.questionnaireIncomplete=false;
            
        } 


        app.makeStickyHeader=function(){
            document.getElementById('trustQuestionnaireTable').addEventListener('scroll',function(event){   
            var stickyHeader='translate(0,'+this.scrollTop+'px)';
            document.getElementById('trustQuestionnaireHeader').style.transform=stickyHeader;     
          });

           document.getElementById('taskQuestionnaireTable').addEventListener('scroll',function(event){   
           var stickyHeader='translate(0,'+this.scrollTop+'px)';
           document.getElementById('taskQuestionnaireHeader').style.transform=stickyHeader;     
          }); 


        }
       
        app.makeQuestionResponsePairs=function(){
          var pairs=[];
          var len=app.questions.length;
          var pair;
          for(var i=0;i<len;i++){
            pair={};
            pair.question=app.questions[i];
            pair.response=app.responses[i];
            pairs.push(pair);
          }
          return pairs;
        }
        

        app.saveGameResponses=function(questions,responses){
          var questionResponsePairs=app.makeQuestionResponsePairs(questions,responses);
          var obj={};
          obj.username=$rootScope.username;
          obj.trustAndTaskQuestionnaire=questionResponsePairs;
          QuestionnaireService.insertQuestionnaireResponse(obj).then(function(returnData){
             if(returnData.data.success){
                var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
                gameSession.lastStageCompleted=$rootScope.TRUST_TASK_QUESTIONNAIRE;
                $cookies.putObject($rootScope.COOKIE_NAME,gameSession,$rootScope.getCookieOptions());
                $location.path('/thankyou');
             }
             else{
              console.log(returnData.data.message);
             }
          });
        } 

        app.makeStickyHeader();
        
    });