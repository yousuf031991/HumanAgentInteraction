angular.module('postGameQuestionnaireControllers', ['questionnaireServices','refreshServices'])
    .controller('postGameQuestionnaireCtrl', function($rootScope,$location,$cookies,QuestionnaireService, Refresh) {
        
        let app = this;
        app.questionnaireIncomplete=false;
        app.headerPosition;
        app.questions=[];
        app.responses=[];
        app.tableRows=[];
        app.unansweredQuestions=[];

        app.trustQuestionnaireRows=[];
        app.taskQuestionnaireRows=[];

        Refresh.checkRefresh();

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

        app.getRows=function(){
          var trustQuestionnaireTable=document.getElementById('trustQuestionnaireTable');
          console.log("No of trust Rows:"+trustQuestionnaireTable.getElementsByClassName("questionnaireRowClass").length);
          app.trustQuestionnaireRows=trustQuestionnaireTable.getElementsByClassName("questionnaireRowClass");
          var taskQuestionnaireTable=document.getElementById('taskQuestionnaireTable');
          app.taskQuestionnaireRows=taskQuestionnaireTable.getElementsByClassName('questionnaireRowClass');
        }


        app.validateResponse=function(){
              
              if(app.username==undefined)
                return;


              if($rootScope.checkTimeout()){
                  $location.path('/timeout');
                  return;
              }
              
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

        app.checkOverlap=function(isTrustQuestionnaire,top,bottom){
          //console.log("Check Overlap");
          var rows;
          if(isTrustQuestionnaire)
            rows=app.trustQuestionnaireRows;
          else
            rows=app.taskQuestionnaireRows;

          
          var len=rows.length;

          //console.log("top:"+top);
          //console.log("Bottom:"+bottom);

          for(var i=0;i<len;i++){
            var row=rows[i];
            var radioButtons=row.getElementsByClassName('questionnaireRadioButton');
            var radioButtonRect=radioButtons[0].getBoundingClientRect();
            //console.log("Radio Button Top:"+radioButtonRect.top);
            //console.log("RadioButton bottom:"+radioButtonRect.bottom);
            if(radioButtonRect.top>=top && radioButtonRect.bottom<=bottom || radioButtonRect.top<=top && radioButtonRect.bottom>=top || radioButtonRect.top<=bottom && radioButtonRect.bottom>=bottom){
              row.style.opacity=0.0;
              row.disabled=true;
            }
            else{
              row.style.opacity=1.0;
              row.disabled=false;
            }
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
            //console.log("Scroll Top:"+this.scrollTop);
            var top=document.getElementById('trustQuestionnaireHeader').getBoundingClientRect().top;
            var bottom=document.getElementById('trustQuestionnaireHeader').getBoundingClientRect().bottom;
            app.checkOverlap(true,top,bottom);     
          });

           document.getElementById('taskQuestionnaireTable').addEventListener('scroll',function(event){   
           var stickyHeader='translate(0,'+this.scrollTop+'px)';
           document.getElementById('taskQuestionnaireHeader').style.transform=stickyHeader;     
           // app.checkOverlap(false,this.scrollTop);
          }); 

           var elements=document.getElementsByClassName("questionnaireRowClass");
           var len=elements.length;
           for(var i=0;i<len;i++){
            var element=elements[i];
            element.addEventListener('scroll',function(event){   
              console.log("Scrolled Row");     
          });

          }


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
          obj.trustAndTaskQuestionnaire=questionResponsePairs;
          QuestionnaireService.insertQuestionnaireResponse(obj).then(function(returnData){
             if(returnData.data.success){
                var data={
                                lastStageCompleted:$rootScope.TRUST_TASK_QUESTIONNAIRE
                         };

                $rootScope.updateGameSession(data);

                $location.path('/thankyou');
             }
             else{
              console.log(returnData.data.message);
             }
          });
        } 
        app.getRows();

        app.makeStickyHeader();
        
    });