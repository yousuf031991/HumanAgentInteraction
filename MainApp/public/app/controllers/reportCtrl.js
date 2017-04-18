angular.module('reportControllers', ['reportServices', 'scrollingServices'])
    .controller('reportCtrl', function (Report, $scope, Scrolling) {
        $scope.allDates = {};
        $scope.today = function () {
            var dt = new Date();
            $scope.allDates = {
                dt1: dt,
                dt2: dt,
                dt3: dt,
                dt4: dt
            };
        };
        $scope.today();

        $scope.clear = function () {
            $scope.allDates = {
                dt1: null,
                dt2: null,
                dt3: null,
                dt4: null
            };
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
            $scope.errorMsg1 = false;
            $scope.successMsg1 = false;
            let dateData = {
                type: "GAME_LOGS",
                fromDate: $scope.allDates.dt1,
                toDate: $scope.allDates.dt2
            };
            Report.getLogs(dateData).then(function (returnData) {
                if (returnData.data.success) {
                    $scope.successMsg1 = returnData.data.message;
                    Scrolling('successReport');
                    // Log in gameLog
                    const reportData = {action: "Generated Game Log: " + $scope.allDates.dt1 + " to " + $scope.allDates.dt2};
                    Report.putLog(reportData);
                } else {
                    $scope.errorMsg1 = returnData.data.message;
                    Scrolling('failureReport');
                }
            });
            $scope.loading1 = false;
        };

        $scope.getLog = function () {
            $scope.loading2 = true;
            Scrolling('loadingLog');
            $scope.errorMsg2 = false;
            $scope.successMsg2 = false;

            let dateData = {
                type: "ADMIN_LOGS",
                fromDate: $scope.allDates.dt3,
                toDate: $scope.allDates.dt4
            };
            Report.getLogs(dateData).then(function (returnData) {
                if (returnData.data.success) {
                    $scope.successMsg2 = returnData.data.message;
                    Scrolling('successLog');
                    // Log in adminLog
                    const reportData = {action: "Generated Admin Log: " + $scope.allDates.dt3 + " to " + $scope.allDates.dt4};
                    Report.putLog(reportData);
                } else {
                    $scope.errorMsg2 = returnData.data.message;
                    Scrolling('failureLog');
                }
            });
            $scope.loading2 = false;
        };

    });