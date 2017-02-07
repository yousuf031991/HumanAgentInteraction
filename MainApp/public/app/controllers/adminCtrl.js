angular.module('adminControllers', ['adminServices'])
    .controller('signInCtrl', function ($scope,$http, $location, Admin) {
        var app = this;
        
        app.client_id=null;

        this.signInAdmin = function (signInData) {
            app.errorMsg = false;
            app.loading = true;
            app.user=null;
            Admin.create(app.signInData).then(function (returnData) {
               
                if (returnData.data.success) {
                    app.successMsg = returnData.data.message;
                    app.user=app.signInData.username;
                    
                    signInWithGmail();
           
                } else {
                    app.errorMsg = returnData.data.message;
                    
                }
                app.loading = false;
            });
        };
    

//Signin with google OAuth2
    let signInWithGmail=function(){
         var options={
                        prompt:"select_account consent", 
                        scope:"profile email"
                    };

         gapi.auth2.getAuthInstance().signIn(options).then(function(googleUser){
                        var email=googleUser.getBasicProfile().getEmail();
                        console.log("Signed in as:"+googleUser.getBasicProfile().getName()); 
                        if(app.user!=email){
                            app.errorMsg="The gmail id "+email+" used for sign in with gmail is not the same as the id "+app.user+" you entered above.Please sign in again with gmail using "+app.user;
                            app.successMsg=false;
                        }
                        else{
                            $location.path('/adminpage');  
                            }
                            $scope.$apply();

                    }); 


    };
  
    //initializes gmail OAuth2 signin functionality
    let loadGmailLogin=function() {
        app.client_id=document.getElementsByTagName('meta').item(name="google-signin-client_id").content;
        console.log("CLienid:"+app.client_id);
        gapi.load('auth2', function(){
          // Retrieve the singleton for the GoogleAuth library and set up the client.
            auth2 = gapi.auth2.init({
                client_id: app.client_id,
                cookiepolicy: 'single_host_origin',
            });
        });
  };
   
  
  //Init Gmail Signin when the page loads
  loadGmailLogin();


});

    