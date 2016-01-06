"use strict";

var {Component, Service, View, Inject, State} = angular2now;

angular.module('mapdiz');

@Component({
  selector: 'invitation',
  controllerAs: 'Invitation',
  bind: {
    ngModel: '='
  }
})

@View({
  templateUrl: 'client/invitation/invitation.html'
})

@Inject('$scope', '$reactive', '$rootScope', '$state', '$log', '$mdDialog')

class Invitation {
  constructor($scope, $reactive, $rootScope, $state, $log, $mdDialog) {
    $log.info('Invitation');

    var self = this;

    let reactiveContext = $reactive(self).attach($scope);

    reactiveContext.helpers({
      users: () => {
        return Meteor.users.find({});
      },
      isLoggedIn: () => {
        return Meteor.userId() !== null;
      },
      currentUserId: () => {
        return Meteor.userId();
      }
    });

    self.invite = invite;
    self.canInvite = canInvite;
    self.friendsCollection = FacebookCollections.getFriends("me",["id","name"],100);
    self.getFBFriends = _getFBFriends;

    ////////////

    function invite(user) {
      Meteor.call('invite', self.ngModel._id, user._id, (error) => {
        if (error) {
          console.log('Oops, unable to invite!');
        }
        else {
          console.log('Invited!');
        }
      });
    }

    function canInvite() {
      if (!self.ngModel)
        return false;

      return !self.ngModel.public && self.ngModel.owner === Meteor.userId();
    }

    function _getFBFriends() {
      console.log('self.friendsCollection.find()', self.friendsCollection.find(), self.friendsCollection.find().fetch())
      self.friends = self.friendsCollection.find().fetch();
    }
  }
}
