"use strict";

var {SetModule, Component, View, Inject, State} = angular2now;
var google; // Used for google place autocomplete

SetModule('mapdiz');

@State({
  name: 'app',
  abstract: true
})

@Component({selector: 'app'})
@View({templateUrl: 'client/app/app.html'})
@Inject('$scope', '$reactive', '$rootScope', '$state', '$meteor', '$log')

class App {

  constructor($scope, $reactive, $rootScope, $state, $meteor, $log) {
    $log.info('App');

    var self = this;

    self.url = url;
    self.profilePics = $meteor.collectionFS(ProfilePics, true);

    let reactiveContext = $reactive(self).attach($scope);
    reactiveContext.subscribe('events');
    reactiveContext.subscribe('images');

    google = $scope.google;

    $scope.$state = $state;



    //////////////////////////

    $rootScope.$on("$stateChangeError",
      function (event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireUser promise is rejected
      // and redirect the user back to the main page
      if (error === "AUTH_REQUIRED") {
        $state.go('app.events');
      }
    });

    $rootScope.$watch('currentUser', (nv, ov) => {
      if (!nv && ov) {
        $state.go('app.events');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });

    $meteor.waitForUser().then( () => {
      if (!$rootScope.currentUser) return;
      var profilePicsHandle;
      var usersHandle;
      $meteor.subscribe('users').then(function(handle) {
        usersHandle = handle;
        self.user =  Meteor.users.findOne($rootScope.currentUser._id);
      });
      $meteor.subscribe('profilePics').then(function(handle) {
        profilePicsHandle = handle;
        self.profilePic = $meteor.object(ProfilePics, self.user.profilePicture, true);
      });

      $scope.$on('$destroy', function() {
        usersHandle.stop();
      });
    });

    function url() {
      var image = self.profilePic;
      if (!image || !image.url) return null;
      return image.url({store: 'profilePic-small'});
    };
  }
}
