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


        signInCallback = function (googleUser) {
            const email = googleUser.getBasicProfile().getEmail();
            console.log('User Email:' + email);

            let data = JSON.stringify({"email": email});
            app.loading = true;

            Auth.create(data)
                .then(function (response) {
                    let message;
                    if (response.data) {
                        // TODO - redirect to home page of admin
                        message = "Admin Valid";
                        $scope.signedIn = true;
                    } else {
                        message = "Admin Invalid";
                        $scope.logOut();
                    }
                    alert(message);
                    app.loading = false;
                });
        };

        failureCallback = function (error) {
            alert("Error: " + error);
        };

        // Render the sign in button.
        $scope.renderSignInButton = function () {
            gapi.signin2.render('my-signin2', {
                'scope': 'profile email',
                'width': 340,
                'height': 50,
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': signInCallback,
                'onfailure': failureCallback
            });
        };

    });