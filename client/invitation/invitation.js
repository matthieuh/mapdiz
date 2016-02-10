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
  templateUrl: 'client/invitation/invitation.html',
  transclude: true
})

@Inject('$scope', '$reactive', '$rootScope', '$state', '$log', '$mdDialog')

class Invitation {
  constructor($scope, $reactive, $rootScope, $state, $log, $mdDialog) {
    $log.info('Invitation');

    var self = this;

    console.log('ngModel', self.ngModel)

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

    self.canInvite = _canInvite;
    self.openModal = _openModal;

    ////////////

    function _canInvite() {
      if (!self.ngModel)
        return false;

      return self.ngModel._id && !self.ngModel.public && self.ngModel.owner === Meteor.userId();
    }



    function _openModal() {
      var parentEl = angular.element(document.querySelector('.main-content'))[0];

      $mdDialog.show({
        parent: parentEl,
        controller: ['$scope', '$rootScope', '$reactive', '$state', '$mdDialog', 'ngModel', _invitationModalCtrl],
        controllerAs: 'InvitationModal',
        templateUrl: 'client/invitation/invitation-modal.html',
        bindToController: true,
        locals: {
          ngModel: self.ngModel
        }
      }).then(function(image) {
        if (image) {
          console.log('new image', image);
          self.picture = image;
        }
      });
    }

    function _invitationModalCtrl($scope, $rootScope, $reactive, $state, $mdDialog, ngModel) {

      var mdSelf = this;

      $reactive(mdSelf).attach($scope);

      mdSelf.helpers({
        users: _usersCollection,
      });

      mdSelf.perPage = 3;
      mdSelf.page = 1;
      mdSelf.sort = {
        name: 1
      };
      mdSelf.ngModel = ngModel;
      mdSelf.orderProperty = '1';
      mdSelf.searchText = '';
      mdSelf.close = _close;
      mdSelf.invite = _invite;
      mdSelf.invites = _invites;
      mdSelf.findUserById = _findUserById;
      mdSelf.isInvited = _isInvited;
      mdSelf.subscribe('usersData', _usersSubscription);

      if (Meteor.user() && Meteor.user().services && Meteor.user().services.facebook) {
        mdSelf.friendsCollection = FacebookCollections.getFriends("me",["id","name"],100);
      }

      ////////////

      function _usersSubscription() {
        return [
          {
            limit: parseInt(mdSelf.perPage),
            skip: parseInt((mdSelf.getReactively('page') - 1) * mdSelf.perPage),
            sort: mdSelf.getReactively('sort')
          },
          mdSelf.getReactively('searchText')
        ];
      }

      function _usersCollection() {
        return Meteor.users.find();
      }

      function _close() {
        $mdDialog.hide();
      }

      function _invite(user) {
        mdSelf.invited = mdSelf.invited || [];
        mdSelf.inviting = mdSelf.inviting || [];
        mdSelf.inviting[user._id] = true;
        Meteor.call('invite', self.ngModel._id, user._id, (error) => {
          mdSelf.inviting[user._id] = false;
          if (!$scope.$$phase) $scope.$apply();
          if (!error) {
            mdSelf.invited[user._id] = true;
          }
          if (!$scope.$$phase) $scope.$apply();
        });
      }

      function _invites(users) {
        Meteor.call('invite', self.ngModel._id, users, (error) => {
          if (error) {
            console.log('Oops, unable to invite users!');
          }
          else {
            console.log('Users Invited!');
          }
        });
      }

      function _getFBFriends() {
        if (self.friendsCollection) {
          console.log('self.friendsCollection.find()', self.friendsCollection.find(), self.friendsCollection.find().fetch())
          self.friends = self.friendsCollection.find().fetch();
        }
      }

      function _findUserById(userId) {
        return _.find(mdSelf.users, {_id: userId});
      }

      function _isInvited(userId) {
        return _.contains(self.ngModel.invited, userId) || userId == Meteor.userId();
      }

    }
  }
}
