"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@Component({
  selector: 'date-range',
  bind: {
    ngModel: '=',
    dateAfter: '=',
    dateBefore: '='
  },
  controllerAs: 'DateRange'
})

@View({
  templateUrl: 'client/date-range/date-range.html',
  transclude: true
})

@Inject('$scope', '$meteor', '$rootScope', '$state', '$log', '$mdDialog')

class DateRange {
  constructor($scope, $meteor, $rootScope, $state, $log, $mdDialog) {
    $log.info('DateRange');
    var template = "<div class=\"mighty-picker__wrapperxx\">\n  <button type=\"button\" class=\"mighty-picker__prev-month\" ng-click=\"moveMonth(-1)\"><<</button>\n  <div class=\"mighty-picker__month\"\n    bindonce ng-repeat=\"month in months track by $index\">\n    <div class=\"mighty-picker__month-name\" ng-bind=\"month.name\"></div>\n    <table class=\"mighty-picker-calendar\">\n      <tr class=\"mighty-picker-calendar__days\">\n        <th bindonce ng-repeat=\"day in month.weeks[1]\"\n          class=\"mighty-picker-calendar__weekday\"\n          bo-text=\"day.date.format('dd')\">\n        </th>\n      </tr>\n      <tr bindonce ng-repeat=\"week in month.weeks\">\n        <td\n            bo-class='{\n              \"mighty-picker-calendar__day\": day,\n              \"mighty-picker-calendar__day--selected\": day.selected,\n              \"mighty-picker-calendar__day--disabled\": day.disabled,\n              \"mighty-picker-calendar__day--marked\": day.marker\n            }'\n            ng-repeat=\"day in week track by $index\" ng-click=\"select(day)\">\n            <div style=\"font-style: italic;\" class=\"mighty-picker-calendar__day-wrapper\"\n              bo-text=\"day.date.date()\"></div>\n            <div class=\"mighty-picker-calendar__day-marker-wrapper\">\n              <div class=\"mighty-picker-calendar__day-marker\"\n                ng-if=\"day.marker\"\n                ng-bind-template=\"\">\n              </div>\n            </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n  <button type=\"button\" class=\"mighty-picker__next-month\" ng-click=\"moveMonth(1)\">>></button>\n</div>";
    var self = this;
    self.showDialog = false;
    self.openDateRangeModal = _openDateRangeModal;
    self.answer = _answer;
    self.options = {
      //callback: _answer,
      //template: template
    };

    /*if (self.dateBefore) {
      self.dateBefore = moment(self.dateBefore).add(1, 'days');
      console.log('self.dateBefore', self.dateBefore);
    }

    if (self.dateAfter) {
      console.log('self.dateAfter', self.dateAfter);
      self.dateAfter = moment(self.dateAfter).subtract(1, 'days');
      console.log('self.dateAfter', self.dateAfter);
    } else {
      self.dateAfter = moment();
    }*/


    $scope.$watch('DateRange.momentDate', function() {
      console.log('DateRange.momentDate', self.momentDate);
    });

    /////////////////

    function _openDateRangeModal() {
      console.log('self.dateBefore', self.dateBefore, self.dateAfter, $scope.dateBefore, $scope.dateAfter);
      if (self.dateAfter) {
        console.log('in test');
        self.mmDateAfter = moment(self.dateAfter).subtract(1, 'days');
        console.log('self.dateAfter', self.mmDateAfter.format('DD-MM-YYYY'))
      } else {
        console.log('in test2');
        self.mmDateAfter = moment();
      }

      if (self.dateBefore) {
        self.mmDateBefore = moment(self.dateBefore).add(1, 'days');
      }

      self.showDialog = true;
    };

    function _answer(day) {
      console.log('_answer');
      self.ngModel = self.momentDate.toDate();
      self.showDialog = false;
    }

    function _filter(day) {
      console.log('day', day, self.dateAfter);
      return self.dateAfter && day.isSame(self.dateAfter);

    }

  }
}
