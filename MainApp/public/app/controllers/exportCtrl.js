angular.module('exportControllers', ['exportServices'])
    .controller('exportCtrl', function (Export, $scope) {
        $scope.listExports = function () {
            Export.list()
                .then(function (returnData) {
                    if (returnData.data.success) {
                        $scope.exportList = returnData.data.data;
                    }
                });
        };

        $scope.toTitleCase = function (str) {
            str = str.toLowerCase();
            str = str.replace("_", " ");
            return str.replace(/(?:^|\s)\w/g, function(match) {
                return match.toUpperCase();
            });
        };

        $scope.getReadableDate = function (date) {
            let dateString=new Date(date).toString();
            try {
                dateString = dateString.split(' ').slice(0, 5).join(' ')
                    + " " + dateString.split(' ').slice(6, 7).join(' ');
            } catch (err) {
                console.log(err);
            }
            return dateString;
        };

        $scope.getDownloadPath = function (path) {
            return "/downloads/" + path;
        };

        $scope.hasCSVFile = function (path) {
            return !!path;
        };

        $scope.getLabelType = function (status) {
            if(status === "UNSUCCESSFUL") {
                return "label-danger";
            } else if(status === "SUCCESSFUL") {
                return "label-success";
            } else {
                return "label-warning";
            }
        };
    });