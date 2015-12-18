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

    console.log('ngModel', self.ngModel);

    let reactiveContext = $reactive(self).attach($scope);

    console.log('ngModel', self.ngModel);

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

  }
}
