"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@Component({
  selector: 'avatar',
  //scope: undefined,
  bind: {
    user: '=',
    userid: '=',
    format: '@',
    width: '@',
    height: '@'
  },
  controllerAs: 'Avatar'
})

@View({
  templateUrl: 'client/avatar/avatar.html'
})

@Inject('$scope', '$log', '$reactive')

class Avatar {
  constructor($scope, $log, $reactive) {
    $log.info('Avatar');

    var self = this;

    $reactive(self).attach($scope);

    /*self.helpers({
      avatar() {
        let avatarId = self.getReactively('user.profile.avatar');
        if (avatarId)
          return Avatars.findOne(avatarId);
      }
    });*/

    //self.subscribe('userAvatar', _avatarSubscription)
    self.getAvatarUrl = _getAvatarUrl;

    $scope.$watch('Avatar.user.profile.avatar', _userAvatarChange);
    $scope.$watch('Avatar.userid', _userIdChange);

    //////////////////

    /*function _userAvatarChange(newValue, oldValue) {
      self.avatar = Avatars.findOne(newValue);
      console.log('_userAvatarChange', newValue, self.user);
    }*/

    function _userIdChange(newValue, oldValue) {
      if (self.userId == Meteor.userId()) {
        self.user = Meteor.user();
      } else {
        self.user = Meteor.users.findOne(self.userid);
      }

      console.log('_userIdChange', newValue, self.user);
    }

    function _getAvatarUrl() {

      let localUser = self.user;
      let format = self.format || 'small';

      if (self.avatar && self.avatar.url) {
        return self.avatar.url(`avatar-${ format }`);
      } else if (localUser && localUser.services && localUser.services.facebook) {
        let fbId = localUser.services.facebook.id;
        let fbAvatarUrl = `https:\/\/graph.facebook.com/${ fbId }/picture/?type=${ format }`;
        return fbAvatarUrl;
      } else {
        return 'assets/images/default-user.png';
      }
    }

    /*function _avatarSubscription() {
      return [self.getReactively('user.profile.avatar')];
    }*/
  }
}
