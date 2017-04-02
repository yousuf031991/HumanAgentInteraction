angular.module('refreshServices', [])
    .factory('Refresh', function ($rootScope, $cookies, $location) {
        
        let refreshFactory={};

        refreshFactory.checkRefresh=function() {
            
            var refreshed=(window.performance.navigation.type==1);
            console.log("Refreshed:"+refreshed);


            if(refreshed){
                    var gameSession=$cookies.getObject($rootScope.COOKIE_NAME);
                    var timeout=$rootScope.checkTimeout(gameSession);
                    if(!timeout){
                        $rootScope.username=gameSession.username;
                    }
                    else{
                        $location.path('/timeout')
                    }
                    
                }
            else if($rootScope.username==undefined){
                    $location.path('/');
                }

        };


    return refreshFactory;
    });