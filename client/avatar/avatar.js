"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@Component({
  selector: 'avatar',
  bind: {
    user: '='
  },
  controllerAs: 'Avatar'
})

@View({
  templateUrl: 'client/avatar/avatar.html',
  transclude: true
})

@Inject('$scope', '$rootScope', '$state', '$log')

class DateRange {
  constructor($scope, $rootScope, $state, $log) {
    $log.info('Avatar');

    var self = this;

    $scope.$watch('Avatar.user', function(oldValue, newValue) {
      $log.debug('Avatar', oldValue, newValue, !Number.isNaN(self.user));

      if ( !Number.isNaN(self.user) ) {
        self.localUser = Meteor.users.findOne(self.user);
        console.log('self.localUser', self.localUser);
      } else if (typeof self.user === 'object') {
        self.localUser = self.user;
      }


      if (self.localUser && self.localUser.avatar) {
        console.log('self.user.avatar', self.localUser.avatar);
        self.avatar = Avatars.findOne(self.localUser.avatar);
        console.log('self.avatar', self.avatar);
      } else {
        delete self.avatar;
      }

    })

  }
}
