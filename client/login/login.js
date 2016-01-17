'use strict';

var {SetModule, Component, View, Inject} = angular2now;

SetModule('mapdiz');

@Component({
  selector: 'login'
})

@View({templateUrl: 'client/login/login.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$log', '$timeout')

class Login {
  constructor($scope, $reactive, $rootScope, $state, $log, $timeout) {
    $log.info('LoginCtrl');

    var self = this;

    $reactive(self).attach($scope);

    self.helpers({
      isLoggedIn() {
        return Meteor.userId() != null;
      },
      currentUser() {
        return Meteor.user();
      }
    });

    self.autorun(() => {
      if (Meteor.user() && Meteor.user().avatar) {
        $timeout(self.avatar = Avatars.findOne(self.getReactively('currentUser.avatar')));
      } else {
        delete self.avatar;
      }
    });

    self.logout = logout;
    self.loginWithPassword = loginWithPassword;
    self.createAccount = createAccount;
    self.changePassword = changePassword;
    self.showPopup = false;
    self.displayCreateAccount = false;
    self.connectedDisplay = 'classic';
    self.togglePopup = togglePopup;
    self.goTo = goTo;
    self.loginWithFacebook = _loginWithFacebook

    //////////////////////

    function togglePopup(forceValue) {
      self.errors = false;
      self.showPopup = forceValue || !self.showPopup;
    }

    function logout() {
      Meteor.logout();
      togglePopup(false);
    }

    function loginWithPassword(user, password) {
      Meteor.loginWithPassword(user, password, displayError)
    }

    function _loginWithFacebook() {
      Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'user_friends', 'user_events', 'user_location']
      }, displayError);
    }

    function createAccount(newAccount) {
      Accounts.createUser(newAccount, displayError);
    }

    function changePassword(oldPassword, newPassword) {
      Accounts.changePassword(oldPassword, newPassword, displayError);
    }

    function displayError(e) {
      if (e) {
        console.log('error', e);
        Session.set("errorMessage", "Please log in to post a comment.");
        if(!$scope.$$phase) {
          self.errors = e.reason;
          $scope.$apply();
        }
      } else {
        self.connectedDisplay = 'classic';
        togglePopup(false);
      }
    }

    function goTo(stateName) {
      $state.go(stateName);
      togglePopup(false);
    }

  }
}
