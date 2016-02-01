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

@Inject('$scope', '$log', '$reactive', '$timeout')

class Avatar {
  constructor($scope, $log, $reactive, $timeout) {
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

    self.autorun(() => {
      _userIdChange();
      _userAvatarChange();
    });

    //////////////////

    function _userAvatarChange() {
      self.avatar = Avatars.findOne(self.getReactively('localUser.profile.avatar'));
      console.log('_userAvatarChange', self.avatar);
    }

    function _userIdChange() {
      if (self.userid) {
        if (self.userId == Meteor.userId()) {
          self.localUser = Meteor.user();
        } else {
          self.localUser = Meteor.users.findOne(self.getReactively('userid'));
        }
      } else { 
        delete self.avatar;
      }

      console.log('_userIdChange', self.user, self.userid);
    }

    function _getAvatarUrl() {

      var localUser = self.localUser;
      var format = self.format || 'small';

      if (self.avatar) {
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
