angular.module('authControllers', ['authServices', 'reportServices'])
    .controller('authController', function($http, $location, $scope, Auth, $routeParams, $window, Report) {
        let app = this;

        if($routeParams.redirect) {
            app.warningMsg = "Please login first.";
        }

        // This flag we can use to show or hide the button in our HTML.
        $scope.signedIn = false;

        this.signInAdmin = function (signInData) {
            app.errorMsg = false;
            app.loading = true;
            app.user=null;
            Auth.verify(app.signInData)
                .then(function (returnData) {
                    if (returnData.data.success) {
                        app.user=app.signInData.username;
                        signInWithGmail();
                    } else {
                        app.errorMsg = returnData.data.message;

                    }
                    app.loading = false;
                });
        };


        //Signin with google OAuth2
        let signInWithGmail=function() {
            const options={
                prompt:"select_account consent",
                scope:"profile email"
            };

            gapi.auth2.getAuthInstance().signIn(options)
                .then(function(googleUser) {
                    const email = googleUser.getBasicProfile().getEmail();
                    const name = googleUser.getBasicProfile().getName();
                    console.log("Signed in as:" + name);

                    if(app.user != email) {
                        app.errorMsg="The gmail id " + email
                            + " used for sign in with gmail is not the same as the id " + app.user
                            + " you entered above.Please sign in again with gmail using " + app.user;
                    } else {
                        // Log in adminLog
                        const reportData = {action: "Admin Logged in", username: email, fullname: name};
                        Report.putLog(reportData);
                        return Auth.signInUser({username: email, fullname: name});
                    }
                })
                .then(function (response) {
                    if(response && response.data) {
                        if(response.data.success) {
                            $window.location.href = response.data.redirectTo;
                        } else {
                            app.errorMsg = JSON.stringify(response.data.error);
                        }
                    }
                    $scope.$apply();
                });
        };

        //initializes gmail OAuth2 signin functionality
        let loadGmailLogin=function() {
            
            let googleClientId=null;
            Auth.getGoogleClientId().then(function(returnData){
                //console.log(JSON.stringify(returnData));
                googleClientId=returnData.data.clientId;
                gapi.load('auth2', function(){
                // Retrieve the singleton for the GoogleAuth library and set up the client.
                auth2 = gapi.auth2.init({
                    client_id: googleClientId,
                    cookiepolicy: 'single_host_origin',
                });
            });
        });

            
        };

        //Init Gmail Signin when the page loads
        loadGmailLogin();

    });