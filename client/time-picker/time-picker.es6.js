"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('secretp');

@Component({
  selector: 'time-picker',
  bind: {
    ngModel: '='
  }
})

@View({
  templateUrl: 'client/time-picker/time-picker.html',
  transclude: true
})

@Inject('$scope', '$meteor', '$rootScope', '$state', '$log', '$mdDialog')

class TimePicker {
  constructor($scope, $meteor, $rootScope, $state, $log, $mdDialog) {
    $log.info('time-picker');

    var self = this;

    self.hours = [];
    self.minutes = [];
    self.answer = answer;

    for(var i = 0; i < 24 ; i++) {
      var h = ("0" + i).slice(-2);
      self.hours.push(h);
      
      if (i%2 == 0) {
        var m = ("0" + i/2*5).slice(-2);
        self.minutes.push(m);
      }
    }

    ////////////

    function answer() {
      $scope.showDialog = false;
      self.ngModel = moment().hour(self.timeHour).minutes(self.timeMinute).toDate();
    }

  }
}
