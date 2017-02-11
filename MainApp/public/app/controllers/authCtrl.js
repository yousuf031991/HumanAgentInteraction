angular.module('authControllers', ['authServices'])
    .controller('authController', function($http, $location, $scope, Auth) {
        let failureCallback, signInCallback;
        let app = this;

        // This flag we can use to show or hide the button in our HTML.
        $scope.signedIn = false;

        $scope.logOut = function() {
            let auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut()
                .then(function () {
                    // TODO - redirect to login page
                    alert('User signed out.');
                });
            auth2.disconnect();
        };

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
                    console.log("Signed in as:"+googleUser.getBasicProfile().getName());

                    if(app.user != email) {
                        app.errorMsg="The gmail id " + email
                            + " used for sign in with gmail is not the same as the id " + app.user
                            + " you entered above.Please sign in again with gmail using " + app.user;
                    } else {
                        return Auth.signInUser({email: email});
                    }
                })
                .then(function (response) {
                    if(response && response.data && response.data.redirectTo) {
                        $location.path(response.data.redirectTo);
                    }
                    $scope.$apply();
                });
        };

        //initializes gmail OAuth2 signin functionality
        let loadGmailLogin=function() {
            app.client_id = document.getElementsByTagName('meta').item(name="google-signin-client_id").content;
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