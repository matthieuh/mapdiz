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

    for(var h = 0; h < 24 ; h++) {
      self.hours.push(h);
      for(var m = 0; m < 12 ; m++) {
        self.minutes.push(m);
      }
    }

  }
}
