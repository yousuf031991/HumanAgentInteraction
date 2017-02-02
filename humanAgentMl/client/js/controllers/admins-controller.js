app.controller('adminsController', ['$scope', '$resource', function ($scope, $resource) {
 
   var Admin = $resource('/api/admins');

   Admin.query(function(results) {

   		$scope.admins = results;
   });

   $scope.admins = []

   	$scope.createAdmin = function() {

   		var admin = new Admin();
   		//console.log($scope.adminName)
         //console.log($scope.adminPassword)
   		admin.name = $scope.adminName;
         admin.password = $scope.adminPassword;
   		admin.$save(function(result) {
   			$scope.admins.push(result)
   			$scope.adminName = '';
            $scope.adminPassword = '';
   		});


   	}
 
}]);


