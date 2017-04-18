angular.module('refreshServices', []) //Service that checks whether a page was refreshed
    .factory('Refresh', function ($rootScope, $cookies, $location) {
        
        let refreshFactory={};

        refreshFactory.checkRefresh=function(currentStage) {
            
            var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);

            if(gameSession.lastStageCompleted>=currentStage){
                $location.path('/');
                return;
            }
  
            var refreshed=(window.performance.navigation.type==1);
                        

            if(refreshed){// If the page is refreshed load the username from cookie
                    var timeout=$rootScope.checkTimeout(gameSession);
                    if(!timeout){
                        $rootScope.username=gameSession.username;
                    }
                    else{
                        $location.path('/timeout')
                    }
                    
                }
            else if($rootScope.username==undefined){ //If the page was directly hit in the browser,i.e. neither refreshed nor navigated from the previous page, then navigate to the base url
                    $location.path('/');
                }

        };


    return refreshFactory;
    });