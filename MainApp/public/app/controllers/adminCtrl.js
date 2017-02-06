angular.module('adminControllers', ['adminServices'])
    .controller('signInCtrl', function ($scope,$http, $location, Admin) {
        var app = this;
        app.showLoginButton=true;
        app.showGmailLogin=false;
        app.signInAsDiffUser=false;         

        this.signInAdmin = function (signInData) {
            app.errorMsg = false;
            app.loading = true;
            app.user=null;
            Admin.create(app.signInData).then(function (returnData) {
               
                if (returnData.data.success) {
                    app.successMsg = returnData.data.message;
                    app.showLoginButton=false;
                    app.showGmailLogin=true;
                    app.signInAsDiffUser=true;
                    app.user=app.signInData.username;
                    //$location.path('/adminpage');
                    //startGmailLogin();
                } else {
                    app.errorMsg = returnData.data.message;
                    
                }
                app.loading = false;
            });
        };
    
  

    startGmailLogin=function() {
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '713815641075-vge8ouravfnq07fko03patep79djuu0o.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        'data-prompt':'select_account'
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      attachSignin(document.getElementById('gmailSignIn'));
    });
  };
   

   attachSignin=function (element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {prompt:'select_account'},
        function(googleUser) {
        console.log("Signed in as:"+googleUser.getBasicProfile().getName()); 
        if(app.user!=googleUser.getBasicProfile().getEmail()){
            app.errorMsg="The gmail id "+googleUser.getBasicProfile().getEmail()+" used for sign in with gmail is not the same as the id "+app.user+" you entered above.Please sign in again with gmail using "+app.user;
            app.successMsg=false;
        }
        else{
            $location.path('/adminpage');  
            }
            $scope.$apply();
        
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

  init=function(){
    console.log("Init");
    startGmailLogin();
  }

  this.changeUser=function(){
       app.showLoginButton=true;
       app.showGmailLogin=false;
       app.successMsg=false;
       app.errorMsg=false;
       app.signInAsDiffUser=false; 
  }

  init();
});

    