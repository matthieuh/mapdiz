"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@Component({
  selector: 'avatar',
  bind: {
    user: '='
  },
  controllerAs: 'Avatar',
  replace: true
})

@View({
  templateUrl: 'client/avatar/avatar.html'
})

@Inject('$scope', '$rootScope', '$state', '$log')

class Avatar {
  constructor($scope, $rootScope, $state, $log) {
    $log.info('Avatar', $scope);

    var self = this;

    /*$scope.$watch('Avatar.user', function(oldValue, newValue) {
      $log.debug('Avatar', oldValue, newValue, self.user);
      if (self.user && self.user.avatar) {
        console.log('self.user.avatar', self.user.avatar);
        self.avatar = Avatars.findOne(self.user.avatar);
        console.log('self.avatar', self.avatar);
      } else {
        delete self.avatar;
      }
    })*/

  }
}
