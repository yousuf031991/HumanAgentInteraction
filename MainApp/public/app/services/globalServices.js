angular.module('globalServices', [])
    .factory('Global', function ($rootScope,$cookies,$location) {
        let globalFactory={};
        globalFactory.setGlobals=function(){
        		    $rootScope.COOKIE_NAME='HospitalManagementGame'; 
        			$rootScope.COOKIE_AGE_YEARS=10;
        			$rootScope.TRIAL_DURATION_HOURS=3;


        			$rootScope.TRIALINFO_PAGE=1;
        			$rootScope.DEMOGRAPHICS_QUESTIONNAIRE=2;
        			$rootScope.GAMEPAGE=3;
        			$rootScope.TRUST_TASK_QUESTIONNAIRE=4; 
        			$rootScope.THANKYOU_PAGE=5;     
              
			        $rootScope.getCookieOptions=function(){
			            var date=new Date();
			            date.setFullYear(date.getFullYear()+$rootScope.COOKIE_AGE_YEARS);
			            var options={};
			            options.expires=date;
			            return options;
			        };


			        $rootScope.checkTimeout=function(gameSession){
			            if(gameSession==undefined)
			            	gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
			            var trialExpiry=new Date(gameSession.trialEnds);
			            var currentTime=new Date();
			            if(currentTime<=trialExpiry){
			                return false;
			            }
			            return true;
			            }

			        $rootScope.createGameSession=function(){
				        var trialExpiry=new Date();
	                    trialExpiry.setHours(trialExpiry.getHours()+$rootScope.TRIAL_DURATION_HOURS);
	                    var gameSession={activeTabs:0,lastStageCompleted:0};
	                    gameSession.trialEnds=trialExpiry.toUTCString(); 
	                    $cookies.putObject($rootScope.COOKIE_NAME,gameSession, $rootScope.getCookieOptions());
	                    return gameSession; 
			        }

			        $rootScope.updateGameSession=function(data){
				       	var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
	                    for(var key in data){
	                    	gameSession[key]=data[key];
	                    }
	                    $cookies.putObject($rootScope.COOKIE_NAME,gameSession,$rootScope.getCookieOptions());
			        }

			        $rootScope.getSession=function(){
			        	var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
	                    if(gameSession==undefined){
	                    	 gameSession=$rootScope.createGameSession();
	                    }
	                    return gameSession;
			        }

			        $rootScope.checkActiveTabs=function(){
			        	var gameSession=$rootScope.getSession();
			        	console.log("activeTabs:"+gameSession.activeTabs);
	                    var activeTabs=gameSession.activeTabs+1
	                    $rootScope.updateGameSession({activeTabs:activeTabs});
			        	if(activeTabs>1){
			        		console.log('Duplicate Session');
			        		$location.path('/duplicateSession');
			        	}
			        }

			        window.onbeforeunload=function(){
			        	var gameSession=$rootScope.getSession();
			        	console.log("activeTabs:"+gameSession.activeTabs);
			        	var activeTabs=gameSession.activeTabs-1;
			        	$rootScope.updateGameSession({activeTabs:activeTabs});	
			        }    

			        window.onload=function(){
			        	$rootScope.checkActiveTabs();
			        }
			        	
        }
        return globalFactory;
	
    });
   