"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@Component({
  selector: 'time-picker',
  bind: {
    ngModel: '=',
    edition: '='
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
    self.answer = _answer;
    self.clear = _clear;
    self.openDialog = _openDialog;
    self.showDialog = false;

    for(var i = 0; i < 24 ; i++) {
      var h = ("0" + i).slice(-2);
      self.hours.push(h);

      if (i%2 == 0) {
        var m = ("0" + i/2*5).slice(-2);
        self.minutes.push(m);
      }
    }

    ////////////

    function _openDialog() {
      if (self.edition) {
        self.showDialog = true;
      }
    }

    function _answer(cancel) {

      if (!cancel) {
        self.ngModel = moment().hour(self.timeHour).minutes(self.timeMinute).toDate();
      }

      self.showDialog = false;
    }

    function _clear() {
      self.ngModel = undefined;
      self.showDialog = false;
    }


  }
}
