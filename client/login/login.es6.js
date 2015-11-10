'use strict';

var {SetModule, Component, View, Inject} = angular2now;

SetModule('secretp');

@Component({selector: 'login'})
@View({templateUrl: 'client/login/login.html'})
@Inject(['$scope', '$meteor', '$rootScope', '$state', '$log'])

class Login {
  constructor($scope, $meteor, $rootScope, $state, $log) {
    $log.info('LoginCtrl');

    var self = this;

    self.logout = logout;
    self.loginWithPassword = loginWithPassword;
    self.createAccount = createAccount;
    self.changePassword = changePassword;
    self.showPopup = false;
    self.displayCreateAccount = false;
    self.connectedDisplay = 'classic';
    self.togglePopup = togglePopup;
    self.goTo = goTo;

    //////////////////////

    function togglePopup(forceValue) {
      self.errors = false;
      self.showPopup = forceValue || !self.showPopup;
    }

    function logout() {
      $meteor.logout();
      togglePopup(false);
    }

    function loginWithPassword(user, password) {
      $meteor.loginWithPassword(user, password, displayError)
    }

    function createAccount() {
      var options = {
        email: self.email,
        password: self.password
      };

      $meteor.createUser(options, displayError);
    }

    function changePassword(oldPassword, newPassword) {
      $meteor.changePassword(oldPassword, newPassword, displayError);
    }

    function displayError(e) {
      if (e) {
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
