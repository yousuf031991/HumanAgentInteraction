angular.module('manageAdminControllers', ['manageAdminServices'])
    .controller('manageAdminCtrl', function (ManageAdmin, $scope) {
        $scope.createNewAdmin = function () {
            $scope.loading = true;
            $scope.user = JSON.stringify({username: $scope.username});
            ManageAdmin.create($scope.user).then(function (returnData) {
            	$scope.failureDeleteMsg=false;
                $scope.successDeleteMsg=false;
                if (returnData.data.success) {
                    $scope.successAddMsg = returnData.data.message;
                    $scope.errorAddMsg=false;
                    $scope.addAdminToUI($scope.user);
                } else {
                	$scope.successAddMsg=false;
                    $scope.errorAddMsg = returnData.data.message;
                }
                $scope.loading = false;
            });
        };

        $scope.removeAdmin = function(adminUserName){
            adminUserName = JSON.stringify({username: adminUserName});
            ManageAdmin.deleteAdm(adminUserName).then(function (returnData){
                $scope.successAddMsg=false;  
				$scope.errorAddMsg=false; 
                if (returnData.data.success) {
                   $scope.failureDeleteMsg=false;
                   $scope.successDeleteMsg=returnData.data.message;
                   $scope.removeAdminFromUI(adminUserName);
                } else {
                	$scope.failureDeleteMsg=returnData.data.message;
                   	$scope.successDeleteMsg=false;
                   
                }
            });
        };

        $scope.listAdmin = function(){
            ManageAdmin.view().then(function (returnData) {
                if (returnData.data.success) {
                    $scope.adminList = returnData.data.data;
                }
            });
        };


		$scope.removeAdminFromUI=function(adminUser){
           adminUser=JSON.parse(adminUser);
           var index;
           var len=$scope.adminList.length;
           var i; 
           var adminUserName=adminUser.username;
           for(i=0;i<len;i++){
           	var username=($scope.adminList)[i].username;
           	if(username==adminUserName){
           		index=i;
           		break;
           	}
           }
           $scope.adminList.splice(index,1);
        };

        $scope.addAdminToUI=function(adminUser){
			adminUser=JSON.parse(adminUser);
			$scope.adminList.push(adminUser);
        };      

    });
