angular.module('roomServices', [])
    .factory('Room', function () {
        /**
         * Constructor, with class name
         */
        function Room(roomId, roomData) {
            // Public properties, assigned to the instance ('this')
            this.roomId = roomId;
            this.patientType = roomData.patientType;
            this.nDoctors = roomData.nDoctors;
            this.nNurses = roomData.nNurses;
            this.nSurgeons = roomData.nSurgeons;
            this.timeLeft = roomData.timeLeft;
            this.timeStarted = roomData.timeStarted;
            this.collect = roomData.collect;
            this.hint = "";
        }

        return Room;
    });