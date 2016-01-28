"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@Component({
  selector: 'avatar',
  bind: {
    user: '=',
    format: '@',
    width: '@',
    height: '@'
  },
  controllerAs: 'Avatar'
})

@View({
  templateUrl: 'client/avatar/avatar.html'
})

@Inject('$scope', '$rootScope', '$state', '$log')

class DateRange {
  constructor($scope, $rootScope, $state, $log) {
    $log.info('Avatar');

    var self = this;

    self.getAvatarUrl = _getAvatarUrl;

    $scope.$watch('Avatar.user.profile.avatar', function(newValue, oldValue) {
      if (self.user && typeof self.user === 'object') {
        self.localUser = self.user;
      } else {
        delete self.avatar;
      }
    });

    $scope.$watch('Avatar.user', function(newValue, oldValue) {
      if (self.user && typeof self.user !== 'object' &&  typeof self.user !== 'string') {
        delete self.avatar;
      }

      if ( self.user && typeof self.user === 'string' ) {
        self.localUser = Meteor.users.findOne(self.user);
      } else {
        delete self.avatar;
      }
    });

    $scope.$watch('Avatar.localUser.profile.avatar', function(newValue, oldValue) {
      if (newValue) {
        self.avatar = Avatars.findOne(newValue);
      } else {
        delete self.avatar;
      }
    });

    //////////////////

    function _getAvatarUrl() {
      if (self.avatar && self.avatar.url) {
        let format = self.format || 'small';
        return self.avatar.url(`avatar-${ format }`);
      }
    }
  }
}
