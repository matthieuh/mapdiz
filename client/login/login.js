'use strict';

var {SetModule, Component, View, Inject} = angular2now;

SetModule('mapdiz');

@Component({
  selector: 'login',
  bind: {
    mode: '@'
  }
})

@View({templateUrl: 'client/login/login.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$log', '$timeout')

class Login {
  constructor($scope, $reactive, $rootScope, $state, $log, $timeout) {
    $log.info('LoginCtrl', this.mode);

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


    self.showPopup = false;
    self.displayCreateAccount = self.mode == 'register';
    self.connectedDisplay = 'classic';
    self.togglePopup = _togglePopup;
    self.goTo = _goTo;
    self.loginWithPassword = _loginWithPassword;
    self.loginWithFacebook = _loginWithFacebook
    self.logout = _logout;
    self.createAccount = _createAccount;
    self.changePassword = _changePassword;

    //////////////////////

    function _togglePopup(forceValue) {
      self.errors = false;
      self.showPopup = forceValue || !self.showPopup;
    }

    function _logout() {
      Meteor.logout();
      _togglePopup(false);
    }

    function _loginWithPassword(user, password) {
      Meteor.loginWithPassword(user, password, _displayError)
    }

    function _loginWithFacebook() {
      Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'user_friends', 'user_events', 'user_location']
      }, _displayError);
    }

    function _createAccount(newAccount) {
      Accounts.createUser(newAccount, _displayError);
    }

    function _changePassword(oldPassword, newPassword) {
      Accounts.changePassword(oldPassword, newPassword, _displayError);
    }

    function _displayError(e) {
      if (e) {
        console.log('error', e, e.error);
        Session.set("errorMessage", "Please log in to post a comment.", _getErrorMessage(e));
        if(!$scope.$$phase) {
          self.errors = _getErrorMessage(e);
          $scope.$apply();
        }
      } else {
        self.connectedDisplay = 'classic';
        _togglePopup(false);
      }
    }

    function _goTo(stateName) {
      $state.go(stateName);
      _togglePopup(false);
    }

    function _getErrorMessage(e) {
      self.unverifiedEmail = false;

      if (e.reason) {
        switch (e.reason) {
          case 'UNVERIFIED_EMAIL':
            self.unverifiedEmail = true;
            return 'Confirmez votre adresse email';

          default:
            return e.reason
        }
      }

    }
  }
}
