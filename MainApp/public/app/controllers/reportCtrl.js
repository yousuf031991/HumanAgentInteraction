angular.module('reportControllers', ['reportServices', 'scrollingServices'])
    .controller('reportCtrl', function (Report, $scope, Scrolling) {
        $scope.today = function () {
            $scope.dt1 = new Date();
            $scope.dt2 = new Date();
            $scope.dt3 = new Date();
            $scope.dt4 = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt1 = null;
            $scope.dt2 = null;
            $scope.dt3 = null;
            $scope.dt4 = null;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            startingDay: 1
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.open3 = function () {
            $scope.popup3.opened = true;
        };
        $scope.open4 = function () {
            $scope.popup4.opened = true;
        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.popup1 = {
            opened: false
        };
        $scope.popup2 = {
            opened: false
        };
        $scope.popup3 = {
            opened: false
        };
        $scope.popup4 = {
            opened: false
        };

        $scope.loading1 = false;
        $scope.errorMsg1 = false;
        $scope.successMsg1 = false;

        $scope.loading2 = false;
        $scope.errorMsg2 = false;
        $scope.successMsg2 = false;

        $scope.getReport = function () {
            $scope.loading1 = true;
            Scrolling('loadingReport');
            console.log($scope.dt1);
            console.log($scope.dt2);
            $scope.loading1 = false;
        };

        $scope.getLog = function () {
            $scope.loading2 = true;
            Scrolling('loadingLog');
            $scope.errorMsg2 = false;
            $scope.successMsg2 = false;
            let dateData = {
                fromDate: $scope.dt3,
                toDate: $scope.dt4
            };
            Report.getLog(dateData).then(function (returnData) {
                if (returnData.data.success) {
                    $scope.successMsg2 = returnData.data.message;
                    Scrolling('successLog');
                    // Log in adminLog
                    const reportData = {action: "Generated Log: " + $scope.dt3 + " to " + $scope.dt4};
                    Report.putLog(reportData);
                } else {
                    $scope.errorMsg2 = returnData.data.message;
                    Scrolling('failureLog');
                }
            });
            $scope.loading2 = false;
        };

    });