angular.module('globalServices', []) //This is a service that sets the global parameters and functions in the rootscope that are used by all the controllers
    .factory('Global', function ($rootScope,$cookies,$location,Refresh) {
        let globalFactory={};
        globalFactory.setGlobals=function(){
        		    $rootScope.COOKIE_NAME='HospitalManagementGame'; 
        			$rootScope.COOKIE_AGE_YEARS=10;
        			$rootScope.TRIAL_DURATION_HOURS=3;


        			$rootScope.TRIALINFO_PAGE=1;
        			$rootScope.DEMOGRAPHICS_QUESTIONNAIRE=2;
        			$rootScope.TUTORIAL=3;
        			$rootScope.PRACTICE_GAME=4;
        			$rootScope.GAMEPAGE=5;
        			$rootScope.TRUST_TASK_QUESTIONNAIRE=6; 
        			$rootScope.THANKYOU_PAGE=7;     
              
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

			        $rootScope.createGameSession=function(version){
				        if(version==undefined)
				        	version=1;
				        var trialExpiry=new Date();
	                    trialExpiry.setHours(trialExpiry.getHours()+$rootScope.TRIAL_DURATION_HOURS);
	                    var gameSession={
	                    					lastStageCompleted:0,
	                    					timesGameLoaded:0,
	                    					version: version

	                    				};
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

			        $rootScope.getGameVersion=function(){
			        	let gameSession=$rootScope.getSession();
			        	return gameSession.version;
			        }

			        	
        }
        return globalFactory;
	});
   